import React, { useEffect, useRef, useState } from "react";
import { Container, VStack, Text, Box, Spinner } from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";

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

  const handleRecordStart = () => {
    setIsRecording(true);
    setStatus("recording");
  };

  const handleRecordStop = () => {
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
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space" && !isRecording) {
        handleRecordStart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRecording]);

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
        <Text>{status === "recording" ? "Recording..." : status === "waiting" ? "Sending to Gemini..." : status === "playing" ? "Playing response..." : "Press and hold spacebar to start recording"}</Text>
      </VStack>
    </Container>
  );
};

export default Index;
