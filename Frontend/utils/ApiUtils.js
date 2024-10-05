// utils/ApiUtils.js
export const uploadVoiceRecording = async (uri) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'voice_recording.m4a',
      type: 'audio/m4a',
    });
  
    try {
      const response = await fetch('https://f1dc-103-57-255-139.ngrok-free.app/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const data = await response.json();
      if (data.success) {
        return data.file_path;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload Error:', error);
    }
  };
  