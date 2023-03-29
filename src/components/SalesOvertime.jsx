import { Card, CardBody, CardHeader, Text } from "@chakra-ui/react";
import React from "react";
import { BsArrowRight } from "react-icons/bs";

const SalesOvertime = () => {
  return (
    <Card>
      <CardHeader>
        <Text as="b" fontSize="2xl">Sales Overtime</Text>
      </CardHeader>
      <CardBody>
        <hr style={{ marginBottom: 10, marginTop: 10 }} />
        <Text as="b" fontSize="lg" className="view-report">View Report{' '}<BsArrowRight/></Text>    
      </CardBody>
    </Card>
  )
}

export default SalesOvertime;