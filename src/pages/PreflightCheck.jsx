import React, { useState } from "react";
import { Box, Heading, Button, Text } from "@chakra-ui/react";

function PreflightCheck() {
  const [micStatus, setMicStatus] = useState("idle");
  const [audioStatus, setAudioStatus] = useState("idle");

  const handleMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus("success");
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.error("Error accessing microphone.", err);
      setMicStatus("failed");
    }
  };

  const handleAudioTest = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAABCxAgAEABAAZGF0YQAAAAA=");
    audio
      .play()
      .then(() => setAudioStatus("success"))
      .catch((err) => {
        console.error("Error playing audio.", err);
        setAudioStatus("failed");
      });
  };

  return (
    <Box>
      <Heading>Preflight Check</Heading>
      <Button onClick={handleMicTest}>Test Microphone</Button>
      <Text>{micStatus === "success" ? "Microphone is working!" : micStatus === "failed" ? "Microphone test failed." : "Press the button to test microphone."}</Text>
      <Button onClick={handleAudioTest}>Test Audio</Button>
      <Text>{audioStatus === "success" ? "Audio is working!" : audioStatus === "failed" ? "Audio test failed." : "Press the button to test audio."}</Text>
    </Box>
  );
}

export default PreflightCheck;
