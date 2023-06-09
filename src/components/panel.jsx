import { Badge, Card, CardBody, CardHeader, Text } from "@chakra-ui/react";
import React from "react";
import { BsArrowRight } from "react-icons/bs";

const Panel = (props) => {
  const { title, headerText, children, icon, color } = props;

  return(
    <Card>
      <CardHeader>
        <Badge variant='subtle' colorScheme={color} style={{padding: '0 5px 0 5px'}}>
          {icon}
        </Badge>
      </CardHeader>
      <CardBody>
        {title}
        <br/>
        <Text fontSize='3xl' as='b'>{headerText}</Text>
        <br/>
        {children}
        <hr style={{ marginBottom: 10, marginTop: 10 }} />
        <Text as="b" fontSize="lg" className="view-report">View Report{' '}<BsArrowRight /></Text>
      </CardBody>
    </Card>
  )
}

export default Panel;