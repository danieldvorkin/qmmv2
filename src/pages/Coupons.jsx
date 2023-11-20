import { useQuery } from "@apollo/client";
import { ButtonGroup, Card, CardBody, CardHeader, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Tooltip } from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaPause, FaPlay, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { GET_COUPONS } from "./graphql/coupons";

const Coupons = () => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    data: coupons,
  } = useQuery(GET_COUPONS);
  
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [confirm, setConfirm] = useState({ header: 'Delete coupon permanently', action: 'Delete' })

  const columns = [
    { name: 'ID', sortable: false, selector: row => <Link to={"/admins/coupons/" + row.id}>00{row.id}</Link>, width: '75px' },
    { name: 'Code', sortable: false, selector: row => row.code, width: '120px' },
    { name: 'Amount', sortable: false, selector: row => `${row.percentage ? '' : '$'}${row.amount}${row.percentage ? '%' : ''}`, width: '90px' },
    { name: 'Exp. Date', sortable: false, selector: row => row.expiration || 'N/A', width: '100px' },
    { name: 'Used', sortable: false, selector: row => row.used, width: '70px' },
    { name: 'Limit', sortable: false, selector: row => row.limit, width: '100px' },
    { name: 'Unlimited?', sortable: false, selector: row => row.unlimitedUses ? 'Yes' : 'No', width: '120px' },
    { name: 'Created', sortable: false, selector: row => format(row.createdAt) },
    { name: 'Last Updated', sortable: false, selector: row => format(row.updatedAt) },
    { name: '', sortable: false, selector: row => {
      return (
        <Tooltip label="Delete" aria-label='confirm delete'>
          <Button variant="ghost" onClick={() => confirmDestroy()} colorScheme={"red"}>
            <FaTimes />
          </Button>
        </Tooltip>
      )
    }, width: '85px' },
    { name: '', sortable: false, selector: row => {
      return (
        <Tooltip label="Deactivate" aria-label='confirm deactivate'>
          <Button variant="ghost" onClick={() => confirmDeactivate()} colorScheme={"blue"}>
            <FaPause />
          </Button>
        </Tooltip>
      )
    }, width: '85px' },
    { name: '', sortable: false, selector: row => {
      return (
        <Tooltip label="Reactivate" aria-label='confirm reactivate'>
          <Button variant="ghost" onClick={() => confirmReactivate()} colorScheme={"green"}>
            <FaPlay />
          </Button>
        </Tooltip>
      )
    }, width: '85px' }
  ]

  const format = (date) => {
    return moment(date).format("MM/DD/YYYY - h:mm");
  }

  const confirmReactivate = () => {
    onOpen();
  }

  const openConfirmation = (actionType) => {
    let state = actionType === 'Delete' ? 'permanently' : 'temporarily';

    setConfirm({ header: `${actionType} coupon ${state}`, action: actionType })
    onOpen()
  }
  
  const confirmDestroy = () => {
    openConfirmation('Delete');
  }
  
  const confirmDeactivate = () => {
    openConfirmation('Deactivate');
  }

  const changePage = (newPage) => {
    setPage(newPage);
  }

  return (
    <Container fluid>
      <Card>
        <CardHeader>
          <ButtonGroup style={{float: 'right'}}>
            <Button color="green" onClick={() => navigate("/admin/coupons/new")}>Add New Coupon</Button>
          </ButtonGroup>
        </CardHeader>
        <CardBody>
          <DataTable
            columns={columns}
            data={coupons?.coupons}
            pagination
            paginationTotalRows={coupons?.length || 0}
            paginationComponentOptions={{ noRowsPerPage: true }} 
            onChangePage={(page) => changePage(page)}
          />
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{confirm?.header}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {confirm?.action === 'Delete' ? (
              <p>Are you sure? It will be destroyed forever</p>
            ) : (
              <p style={{display: 'flex'}}>You can reactivate this coupon by clicking <FaPlay style={{ marginLeft: 5, marginRight: 5, position: 'relative', top: 3 }} color="green" /> 'Reactivate'</p>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='silver' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme={`${confirm?.action === 'Delete' ? 'red' : 'blue'}`}>{confirm?.action} Coupon</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
}

export default Coupons;