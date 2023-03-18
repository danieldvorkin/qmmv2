import React from "react";
import { Slider, SliderMark, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";

const CustomSlider = (props) => {
  return (
    <Slider aria-label='slider-ex-6' onChange={(val) => props.setValue(val)}>
      <SliderMark
        value={props.sliderValue}
        textAlign='center'
        bg='white.500'
        color='blue.500'
        mt='-10'
        ml='-5'
        w='12'
      >
        {props.sliderValue}%
      </SliderMark>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  )
}

export default CustomSlider;