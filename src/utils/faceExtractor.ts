import * as tf from '@tensorflow/tfjs';
import { FaceDetectionResult } from '../types';

export async function extractFaceFeatures(face: FaceDetectionResult) {
  if (!face.landmarks || face.landmarks.length === 0) {
    throw new Error('No facial landmarks detected');
  }

  return tf.tidy(() => {
    try {
      const { landmarks, boundingBox } = face;
      
      // Ensure we have valid bounding box coordinates
      const width = boundingBox[2] - boundingBox[0];
      const height = boundingBox[3] - boundingBox[1];
      
      if (width <= 0 || height <= 0) {
        throw new Error('Invalid face bounding box');
      }

      const landmarkArray = landmarks.map(point => [
        (point[0] - boundingBox[0]) / width,
        (point[1] - boundingBox[1]) / height
      ]);
      
      return tf.tensor2d(landmarkArray);
    } catch (error) {
      throw new Error('Failed to extract face features');
    }
  });
}