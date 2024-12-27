import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import { FaceDetectionResult } from '../types';

let model: blazeface.BlazeFaceModel | null = null;

export async function initializeModel(): Promise<void> {
  if (!model) {
    try {
      model = await blazeface.load();
    } catch (error) {
      throw new Error('Failed to load face detection model');
    }
  }
}

export async function detectFace(imageFile: File): Promise<FaceDetectionResult | null> {
  if (!model) {
    await initializeModel();
  }

  const image = await createImageBitmap(imageFile);
  const tensor = tf.browser.fromPixels(image);
  
  try {
    const predictions = await model!.estimateFaces(tensor, false);
    
    if (!predictions || predictions.length === 0) {
      return null;
    }

    const face = predictions[0];
    
    // Validate that we have the required face data
    if (!face.landmarks || !face.topLeft || !face.bottomRight) {
      throw new Error('Invalid face detection result');
    }

    // Convert the face data to our expected format
    return {
      landmarks: Array.isArray(face.landmarks) ? face.landmarks : [],
      boundingBox: [
        face.topLeft[0],
        face.topLeft[1],
        face.bottomRight[0],
        face.bottomRight[1]
      ]
    };
  } catch (error) {
    console.error('Face detection error:', error);
    throw new Error('Failed to detect face in image');
  } finally {
    tensor.dispose();
  }
}