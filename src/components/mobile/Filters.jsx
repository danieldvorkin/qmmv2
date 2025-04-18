import React, { useRef, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  Button,
} from "@chakra-ui/react";
import styled from "styled-components";
import { ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
  height: 65px !important;
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
  const navigate = useNavigate();

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
                        const searchParams = new URLSearchParams(window.location.search);
                        searchParams.set("category", category.slug);
                        navigate(`?${searchParams.toString().toLowerCase()}`);
                        onClose();
                      }}
                      style={{ border: 'none' }}>{category.name}</Dropdown.Item>
                  )
                })}

              </DropdownButton>
            )}
            <DropdownButton
              as={ButtonGroup}
              id={"type"}
              size="md"
              key={`dropdown-type`}
              variant="outline-secondary"
              title={"Strain Types"}
              style={{ margin: '10px 0', width: '98%', border: 'none !important' }}
              >
              {["Indica", "Hybrid", "Sativa"].map((option) => {
                return (
                  <Dropdown.Item 
                    eventKey={option} 
                    onClick={() => {
                      const searchParams = new URLSearchParams(window.location.search);
                      searchParams.set("type", option);
                      navigate(`?${searchParams.toString().toLowerCase()}`);
                      onClose();
                    }} 
                    style={{ border: 'none' }}
                  >
                    {option}
                  </Dropdown.Item>
                  )
                })}
            </DropdownButton>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Filters;
