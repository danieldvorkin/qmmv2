import React from "react";
import { ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const FilterContainer = styled.div`
  display: flex;
`;

const Filters = ({ categories }) => {
  const navigate = useNavigate();

  return (
    <FilterContainer>
      {Object.keys(categories).map((key) => 
        <>
          <p>{categories[key].name}</p>
          <DropdownButton
            as={ButtonGroup}
            id={"filter"}
            size="sm"
            key={`dropdown-${key}`}
            variant="outline-secondary"
            title={key}
            style={{ marginRight: 5, border: 'none !important' }}
            >
            {categories[key]?.map((category) => {
              return (
                <Dropdown.Item
                  eventKey={category.slug}
                  onClick={() => { 
                    const searchParams = new URLSearchParams(window.location.search);
                    searchParams.set("category", category.slug);
                    navigate(`?${searchParams.toString().toLowerCase()}`);
                  }}
                  style={{ border: 'none' }}
                  key={category.slug}
                >
                  {category.name}
                </Dropdown.Item>
              )
            })}
          </DropdownButton>
        </>
      )}

      <DropdownButton
        as={ButtonGroup}
        id={"type"}
        size="sm"
        key={`dropdown-type`}
        variant="outline-secondary"
        title={"Strain Types"}
        style={{ marginRight: 5, border: 'none !important' }}
        >
        {["Indica", "Hybrid", "Sativa"].map((option) => {
          return (
            <Dropdown.Item 
              eventKey={option} 
              onClick={() => {
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.set("type", option);
                navigate(`?${searchParams.toString().toLowerCase()}`);
              }} 
              style={{ border: 'none' }}
            >
              {option}
            </Dropdown.Item>
            )
          })}
      </DropdownButton>
    </FilterContainer>
  )
}

export default Filters;