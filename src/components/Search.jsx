// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Upload, Video } from 'lucide-react';
import * as faceapi from 'face-api.js';

export default function Search() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelLoadTime, setModelLoadTime] = useState(null);
  const [ageResults, setAgeResults] = useState([]);
  const [expressionResults, setExpressionResults] = useState([]);
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  useEffect(() => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';

    const loadModels = async () => {
      try {
        const startTime = performance.now();
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        const endTime = performance.now();
        setModelLoadTime(((endTime - startTime) / 1000).toFixed(2));
        setModelsLoaded(true);
      } catch (error) {
        console.error('Error loading face-api models:', error);
        alert(`Failed to load face detection models. Please refresh the page and try again. Error: ${error.message}`);
        setModelsLoaded(false);
      }
    };

    loadModels();
  }, []);

  // Removed useEffect that automatically starts/stops video based on useCamera and modelsLoaded

  const startVideo = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          detectionIntervalRef.current = setInterval(async () => {
            if (videoRef.current && modelsLoaded) {
              const detections = await faceapi
                .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withAgeAndGender()
                .withFaceExpressions();

              if (detections.length > 0) {
                const ages = detections.map((detection, index) => ({
                  age: detection.age.toFixed(1),
                  gender: detection.gender,
                  genderProbability: (detection.genderProbability * 100).toFixed(1),
                  box: detection.detection.box,
                  id: index,
                }));

                const expressions = detections.map((detection, index) => ({
                  expressions: detection.expressions,
                  id: index,
                }));

                setAgeResults(ages);
                setExpressionResults(expressions);

                if (canvasRef.current) {
                  const canvas = canvasRef.current;
                  const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
                  faceapi.matchDimensions(canvas, displaySize);
                  const resizedDetections = faceapi.resizeResults(detections, displaySize);
                  const ctx = canvas.getContext('2d');
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  resizedDetections.forEach(detection => {
                    const box = detection.detection.box;
                    ctx.strokeStyle = '#00FF00';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(box.x, box.y, box.width, box.height);
                  });
                }
              } else {
                setAgeResults([]);
                setExpressionResults([]);
                if (canvasRef.current) {
                  const ctx = canvasRef.current.getContext('2d');
                  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }
              }
            }
          }, 1000);
        })
        .catch((err) => {
          console.error('Error accessing camera:', err);
          alert('Unable to access camera. Please check permissions and try again.');
          setUseCamera(false);
        });
    } else {
      alert('Camera API not supported in this browser.');
      setUseCamera(false);
    }
  };

  const stopVideo = () => {
    console.log('Stopping video and releasing camera');
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
    setAgeResults([]);
    setExpressionResults([]);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImageLoaded(false);

      // Relaxed file type check to accept all image types starting with "image/"
      if (!selectedFile.type.startsWith('image/') || selectedFile.size > 10 * 1024 * 1024) {
        alert('Please upload a valid image file under 10MB.');
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const loadImage = (dataUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = dataUrl;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    console.log('handleSubmit triggered');
    setLoading(true);
    setAgeResults([]);
    setExpressionResults([]);

    try {
      const img = await loadImage(preview);
      console.log('Image loaded for detection:', img);

      // Wait for image to be fully loaded before detection
      await new Promise((resolve) => {
        if (img.complete && img.naturalHeight !== 0) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      });

      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withAgeAndGender()
        .withFaceExpressions();

      console.log('Detections:', detections);

      if (!detections.length) {
        alert('No faces detected in the uploaded image.');
        setLoading(false);
        return;
      }

      const ages = detections.map((detection, index) => ({
        age: detection.age.toFixed(1),
        gender: detection.gender,
        genderProbability: (detection.genderProbability * 100).toFixed(1),
        box: detection.detection.box,
        id: index,
      }));

      const expressions = detections.map((detection, index) => ({
        expressions: detection.expressions,
        id: index,
      }));

      setAgeResults(ages);
      setExpressionResults(expressions);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 items-center min-h-[73vh] lg:px-5 py-12">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-2xl xs:text-xl font-bold text-gray-900 sm:text-3xl">Age and Expression Detection</h1>
        <p className="mt-4 text-md xs:text-sm text-gray-500">
          Upload an image to detect the age, gender, and facial expressions of the person(s) in the image.
        </p>
        <div className="mt-4 flex   gap-5 justify-center items-center border-2 p-3 rounded-md text-gray-500 ">
          <h5 className='flex gap-2 items-center justify-center xs:text-sm md:text-lg font-bold'>Wanna Try with Real faces? Try It Out.</h5>
          <button
            type="button"
            onClick={() => {
              if (useCamera) {
                stopVideo();
                setUseCamera(false);
              } else {
                if (modelsLoaded) {
                  startVideo();
                  setUseCamera(true);
                } else {
                  alert('Models are not loaded yet. Please wait.');
                }
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-black  xs:py-1 xs:w-3/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {useCamera ? 'Stop Camera' : 'Start Camera'}
          </button>
        </div>
      </div>

      {useCamera ? (
        <div className="relative w-full max-w-3xl mx-auto">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full rounded-lg"
            style={{ maxHeight: '480px' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ maxHeight: '480px' }}
          />
          {ageResults.length > 0 && (
            <div className="mt-4 space-y-4 ">
              {ageResults.map(({ age, gender, genderProbability, id }) => (
                <div key={id} className="bg-white flex   justify-around items-center pt-2 rounded-lg shadow text-center">
                  <p className="text-lg xs:text-[13px] font-medium text-blue-600">
                    <strong className='text-black'> Age:</strong> {age} years
                  </p>
                  <p className="text-md xs:text-[13px] text-blue-600 capitalize">
                    <strong className='text-black'> Gender:</strong> {gender} ({genderProbability}% )
                  </p>
                  <ul className="text-lg font-medium text-blue-600">
                    {Object.entries(expressionResults.find(exp => exp.id === id)?.expressions || {})
                      .filter(([expression, value]) => value > 0.2)
                      .map(([expression, value]) => (
                        <li key={expression} className="capitalize xs:text-[13px]">
                          <strong className='text-black xs:text-[13px]'> {expression}:</strong> {(value * 100).toFixed(1)}%
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 ">
          <div className="space-y-6">
            <div className="w-full border-2 p-3 border-dashed rounded-md text-center">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer text-center"
              >
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="space-y-1">
                  <div className="flex justify-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(false)}
                      />
                    ) : (
                      <Upload className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="text-gray-600">
                    <span>Upload an image to detect age, gender, and facial expressions</span>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={!file || loading || !imageLoaded || !modelsLoaded}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(!file || loading || !imageLoaded || !modelsLoaded) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity -25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Detect Age and Expressions'
              )}
            </button>
            {ageResults.length > 0 && (
              <div className="mt-4 space-y-4">
                {ageResults.map(({ age, gender, genderProbability, id }) => (
                  <div key={id} className="bg-white flex  justify-around items-center pt-2 rounded-lg shadow text-center">
                    <p className="text-lg xs:text-[13px] font-medium text-blue-600">
                      <strong className='text-black'> Age:</strong> {age} years
                    </p>
                    <p className="text-md xs:text-[13px] text-blue-600 capitalize">
                      <strong className='text-black'> Gender:</strong> {gender} ({genderProbability}% )
                    </p>
                    <ul className="text-lg font-medium  text-blue-600">
                      {Object.entries(expressionResults.find(exp => exp.id === id)?.expressions || {})
                        .filter(([expression, value]) => value > 0.2)
                        .map(([expression, value]) => (
                          <li key={expression} className="capitalize xs:text-[10px]">
                            <strong className='text-black xs:text-[13px]'> {expression}:</strong> {(value * 100).toFixed(1)}%
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
)}
    </div>
  </div>
  );
}
