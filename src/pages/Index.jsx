import React, { useEffect, useRef, useState } from "react";
import { Container, VStack, Text, Box, IconButton, Spinner } from "@chakra-ui/react";
import { FaMicrophone, FaVideo } from "react-icons/fa";

const Index = () => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [status, setStatus] = useState("idle");
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
      setStatus("waiting");

      sendToGeminiAPI(audioStream)
        .then((response) => {
          setStatus("playing");
          playResponse(response);
        })
        .catch((error) => {
          console.error("Error sending to Gemini API", error);
          setStatus("idle");
        });
    } else {
      // Start recording
      setIsRecording(true);
      setStatus("recording");
    }
  };

  const sendToGeminiAPI = async (stream) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Response from Gemini API");
      }, 2000);
    });
  };

  const playResponse = (response) => {
    console.log(response);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Camera and Microphone Access</Text>
        <Box>
          <video ref={videoRef} autoPlay style={{ width: "100%", height: "auto" }} />
        </Box>
        <IconButton aria-label="Record" icon={status === "recording" ? <FaMicrophone /> : <FaVideo />} size="lg" onClick={handleRecord} />
        {status === "waiting" ? <Spinner size="lg" /> : <Text>{status === "recording" ? "Recording..." : status === "playing" ? "Playing response..." : "Click to start recording"}</Text>}
      </VStack>
    </Container>
  );
};

export default Index;
