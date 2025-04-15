import { Select } from "@chakra-ui/react";
import React from "react";

const AutoSuggest = ({ suggestions, placeholder, label }) => {
  return (
    <Select placeholder='Select option'>
      {suggestions.map((suggestion, index) => (
        <option key={index} value={suggestion}>
          {suggestion}
        </option>
      ))}
    </Select>
  );
}
export default AutoSuggest;