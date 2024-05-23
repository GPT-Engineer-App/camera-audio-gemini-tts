import React, { useEffect, useRef, useState } from "react";
import { Container, VStack, Text, Box, Button } from "@chakra-ui/react";
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

  const handleRecordStart = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setIsRecording(true);
      setStatus("recording");

      let audioChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks);
        sendToGeminiAPI(audioBlob);
        setIsRecording(false);
        setStatus("waiting");
      };

      setAudioStream(mediaRecorder);
    } catch (err) {
      console.error("Error accessing audio devices.", err);
    }
  };

  const handleRecordStop = () => {
    if (audioStream) {
      audioStream.stop();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space" && !isRecording) {
        handleRecordStart();
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === "Space" && isRecording) {
        handleRecordStop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isRecording]);

  const sendToGeminiAPI = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const response = await fetch("https://api.your-gemini-endpoint.com/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GOOGLE_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result;
      while (!(result = await reader.read()).done) {
        const chunk = decoder.decode(result.value, { stream: true });
        console.log("Received chunk:", chunk);
        playResponse(chunk);
      }
    } catch (error) {
      console.error("Error sending data to Gemini API:", error);
      setStatus("idle");
    }
  };

  const playResponse = (response) => {
    const audio = new Audio("data:audio/wav;base64," + btoa(response));
    audio.play();
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" position="relative">
      <VStack spacing={4}>
        <Text fontSize="2xl">Camera and Microphone Access</Text>
        <Box>
          <video ref={videoRef} autoPlay style={{ width: "100%", height: "auto" }} />
        </Box>
        <Text>{status === "recording" ? "Recording..." : status === "waiting" ? "Sending to Gemini..." : status === "playing" ? "Playing response..." : "Press and hold spacebar to start recording"}</Text>
        <Button onClick={handleRecordStart} disabled={isRecording} position="fixed" bottom="10px">
          Start Preflight Audio Check
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;
