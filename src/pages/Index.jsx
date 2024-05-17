import React, { useEffect, useRef, useState } from "react";
import { Container, Button, VStack, Text, Box, IconButton } from "@chakra-ui/react";
import { FaMicrophone, FaVideo } from "react-icons/fa";

const Index = () => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [videoStream, setVideoStream] = useState(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current.srcObject = stream;
        setVideoStream(stream);
        setAudioStream(stream);
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    getMedia();
  }, []);

  const handleRecord = () => {
    if (isRecording) {
      // Stop recording
      audioStream.getTracks().forEach((track) => track.stop());
      videoStream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    } else {
      // Start recording
      setIsRecording(true);
      // Placeholder for starting audio recording and sending to Gemini API
      // You would integrate the Gemini API here
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Camera and Microphone Access</Text>
        <Box>
          <video ref={videoRef} autoPlay style={{ width: "100%", height: "auto" }} />
        </Box>
        <IconButton aria-label="Record" icon={isRecording ? <FaMicrophone /> : <FaVideo />} size="lg" onClick={handleRecord} />
        <Text>{isRecording ? "Recording..." : "Click to start recording"}</Text>
      </VStack>
    </Container>
  );
};

export default Index;
