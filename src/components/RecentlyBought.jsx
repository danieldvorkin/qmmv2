import { CloseIcon } from "@chakra-ui/icons";
import { Avatar, Box, Card, CardBody, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { getItem, getOrders } from "../utils/util";
import { useNavigate } from "react-router-dom";

const RecentlyBought = () => {
  const [orderCount, setOrderCount] = useState(0);
  const [mostRecentOrders, setMostRecentOrders] = useState([]);
  const [showRecentlyBoughtBadge, setShowRecentlyBoughtBadge] = useState(true);
  const [stopShowingRecentlyBought, setStopShowingRecentlyBought] = useState(false);
  const [recentlyBought, setRecentlyBought] = useState({});

  const navigate = useNavigate();

  React.useEffect(() => {
      const intervalId = setInterval(() => {
        fetchOrders();
        if (!!recentlyBought.item) {
          getItem(recentlyBought.item.slug).then((resp) => {
            if (!!resp.id) {
              setRecentlyBought({ ...recentlyBought, item: resp });
            }
          });
        }
      }, 30000);
    
      return () => {
        clearInterval(intervalId);
      };
    }, [orderCount, recentlyBought.item]);

  const fetchOrders = async () => {
    if (!stopShowingRecentlyBought) {
      try {
        setShowRecentlyBoughtBadge(false);
        let recentlyBoughtItem = null;

        if (mostRecentOrders.length === 0) {
          const resp = await getOrders(1, 'Order Delivered');

          if (resp.orders.length > 0) {
            setMostRecentOrders(resp.orders);
            recentlyBoughtItem = resp.orders[orderCount].line_items[0];
          }
        } else {
          if (!!mostRecentOrders[orderCount]) {
            recentlyBoughtItem = mostRecentOrders[orderCount].line_items[0];
          } else {
            setOrderCount(0);
            recentlyBoughtItem = mostRecentOrders[orderCount].line_items[0];
          }
        }

        if (recentlyBoughtItem?.item?.inventory > 0) {
          setRecentlyBought(recentlyBoughtItem);
          setOrderCount((prevOrderCount) => prevOrderCount + 1);
        }

        setShowRecentlyBoughtBadge(true);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };

  const determineScale = () => {
    if (!!recentlyBought && !!recentlyBought.item) {
      if (recentlyBought.item?.category?.type_of === "Strains") {
        return "g";
      }
    }
  };

  return (
    false && !stopShowingRecentlyBought && showRecentlyBoughtBadge && !!recentlyBought.item && (
      <div className="recentlyBought">
        <Card>
          <CardBody>
            <Flex>
              <Avatar name={recentlyBought && recentlyBought.item?.name} src={recentlyBought.item?.cover_photo} />
              <Box ml="3" onClick={() => navigate("/products/" + recentlyBought.item?.slug)} style={{ cursor: 'pointer', width: '100%' }}>
                <Text fontWeight='bold'>
                  Someone Recently Bought
                </Text>
                {recentlyBought && (
                  <Text fontSize='sm'>{recentlyBought?.quantity}{determineScale()} of {recentlyBought.item?.name}</Text>
                )}
              </Box>
              <CloseIcon style={{ cursor: 'pointer', right: 0, position: 'relative' }} ml="3" onClick={() => setStopShowingRecentlyBought(true)} />
            </Flex>
          </CardBody>
        </Card>
      </div>
    )
  );
}

export default RecentlyBought;