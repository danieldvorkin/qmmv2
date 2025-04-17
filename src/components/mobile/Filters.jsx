import React, { useRef, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
} from "@chakra-ui/react";
import styled from "styled-components";
import { ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";

const FloatingButton = styled(Button)`
  position: fixed !important;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color:rgb(0, 60, 255) !important;
  color: white;
  border: none;
  border-radius: 50% !important;
  padding: 10px;
  height: 75px !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
    transition: background-color 0.3s, transform 0.3s;
  }
`;


const Filters = ({ categories, setFilterSlug }) => {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef();

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <FloatingButton bg={'primary'} ref={btnRef} onClick={onOpen}>
        Menu
      </FloatingButton>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            {Object.keys(categories).map((key) =>
              <DropdownButton
              as={ButtonGroup}
              id={"filter"}
              size="md"
              key={`dropdown-${key}`}
              variant="outline-secondary"
              title={key}
              style={{ width: '98%', margin: '10px 0px', border: 'none !important' }}
              >
                {categories[key].map((category) => {
                  return (
                    <Dropdown.Item
                      eventKey={category.slug}
                      onClick={() => { 
                        setFilterSlug(category?.slug);
                        onClose();
                      }}
                      style={{ border: 'none' }}>{category.name}</Dropdown.Item>
                  )
                })}

              </DropdownButton>
            )}
          </DrawerBody>

          {/* <DrawerFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Apply
            </Button>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Filters;
