import { useMutation, useQuery } from "@apollo/client";
import { HamburgerIcon } from "@chakra-ui/icons";
import { ButtonGroup, Card, CardBody, CardHeader, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Tooltip, Menu, MenuButton, IconButton, MenuList, MenuItem, Text, Icon } from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaPause, FaPlay, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AppToaster } from "../toast";
import { DEACTIVATE_COUPON, DELETE_COUPON, GET_COUPONS, REACTIVATE_COUPON } from "./graphql/coupons";

const Coupons = () => {
  const navigate = useNavigate();
  const { loading, error, data: coupons, refetch
  } = useQuery(GET_COUPONS);
  
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [confirm, setConfirm] = useState({ header: 'Delete coupon permanently', action: 'Delete' });
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const [reactivateCoupon] = useMutation(REACTIVATE_COUPON);
  const [deactivateCoupon] = useMutation(DEACTIVATE_COUPON);
  const [deleteCoupon] = useMutation(DELETE_COUPON);

  const rowStatusIcon = (coupon) => {
    return (
      <Tooltip label={coupon?.active ? 'Active' : 'Deactivated'}>
        <Icon viewBox='0 0 200 200' color={`${coupon?.active ? 'green' : 'red'}.500`} cursor="pointer">
          <path fill='currentColor' d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0' />
        </Icon>
      </Tooltip>
    )
  }

  const columns = [
    { name: '', sortable: false, selector: row => rowStatusIcon(row), width: '44px'},
    { name: 'Code', sortable: false, selector: row => <Link to={"/admin/coupons/" + row.id}>{row.code}</Link>, width: '120px' },
    { name: 'Amount', sortable: false, selector: row => `${row.percentage ? '' : '$'}${row.amount}${row.percentage ? '%' : ''}`, width: '80px' },
    { name: 'Exp. Date', sortable: false, selector: row => row.expiration || 'N/A', width: '120px' },
    { name: 'Used', sortable: false, selector: row => row.used, width: '70px' },
    { name: 'Limit', sortable: false, selector: row => row.limit, width: '100px' },
    { name: 'Unlimited?', sortable: false, selector: row => row.unlimitedUses ? 'Yes' : 'No', width: '120px' },
    { name: 'Created', sortable: false, selector: row => format(row.createdAt), width: '175px' },
    { name: 'Last Updated', sortable: false, selector: row => format(row.updatedAt), width: '175px' },
    { name: '', sortable: false, selector: row => {
      return (
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<><HamburgerIcon />&nbsp;<Text fontSize="xs">Actions</Text></>}
            variant='ghost'
            paddingLeft={1}
            paddingRight={1}
          />
          <MenuList style={{maxWidth: 200}}>
            <MenuItem icon={<FaPause color="blue" />} onClick={() => openConfirmation('Deactivate', row)}>Deactivate</MenuItem>
            <MenuItem icon={<FaTimes color="red" />} onClick={() => openConfirmation('Delete', row)}>Delete</MenuItem>
            <MenuItem icon={<FaPlay color="green" />} onClick={() => openConfirmation('Reactivate', row)}>Reactivate</MenuItem>
          </MenuList>
        </Menu>
      )
    }, width: '120px'}
  ]

  const format = (date) => moment(date).format("MM/DD/YYYY - h:mm a");
  
  const openConfirmation = (actionType, coupon) => {
    let state = '';

    switch (actionType) {
      case 'Delete':
        state = 'permanently'
        break;
      case 'Deactivate':
        state = 'temporarily'
        break;
      case 'Reactivate':
        state = ''
        break;
      default:
        break;
    }

    setConfirm({ header: `${actionType} coupon ${state}`, action: actionType })
    onOpen()
    setSelectedCoupon(coupon)
  }

  const changePage = (newPage) => {
    setPage(newPage);
  }

  const handleCouponAction = async (actionType) => {
    const mutationFunction = actionType === 'Delete' ? deleteCoupon :
                              actionType === 'Deactivate' ? deactivateCoupon :
                              actionType === 'Reactivate' ? reactivateCoupon :
                              null;
  
    if (mutationFunction) {
      await mutationFunction({
        variables: { id: String(selectedCoupon?.id) },
      }).then((resp) => {
        if(!!resp.data){
          refetch();
        }
      }).catch((error) => {
        AppToaster.show({ message: error })
      });
    }
    onClose();
  };

  const titleize = (str) => {
    return str.toLowerCase().replace(/(?:^|\s|-)\S/g, function(match) {
      return match.toUpperCase();
    });
  }

  const getPopupActionConfig = () => {
    let colorScheme = confirm?.action === 'Delete' ? 'red' : (confirm?.action === 'Reactivate' ? 'green' : 'blue')
    let action = null;

    switch(confirm?.action){
      case 'Delete':
        action = handleCouponAction;
        break;
      case 'Deactivate':
        action = handleCouponAction;
        break;
      case 'Reactivate':
        action = handleCouponAction;
        break;
      default:
        break;
    }
    
    return {
      colorScheme: colorScheme,
      btnText: titleize(confirm?.action),
      action: action
    }
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
              confirm?.action === 'Reactivate' ? (
                <p style={{display: 'flex'}}>Coupon will become active</p>
              ) : (
                <p style={{display: 'flex'}}>You can reactivate this coupon by clicking <FaPlay style={{ marginLeft: 5, marginRight: 5, position: 'relative', top: 3 }} color="green" /> 'Reactivate'</p>
              )
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='silver' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button 
              colorScheme={getPopupActionConfig()['colorScheme']}
              onClick={() => getPopupActionConfig()['action'](confirm?.action)}
            >{getPopupActionConfig()['btnText']} Coupon</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
}

export default Coupons;