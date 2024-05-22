import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Button } from "@chakra-ui/react";

function Navigation() {
  return (
    <Box bg="teal.500" p={4}>
      <Flex justify="space-between">
        <Link to="/">
          <Button colorScheme="teal" variant="ghost">
            Home
          </Button>
        </Link>
        <Link to="/preflight">
          <Button colorScheme="teal" variant="ghost">
            Preflight Check
          </Button>
        </Link>
      </Flex>
    </Box>
  );
}

export default Navigation;
