import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import Table from "react-bootstrap/Table";
import './admindashboard.css';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import avataricon from '../../images/profile.png';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';



const AdminDashboard = () => {

  const [rides, setRides] = useState();

  const [rideHistory, setRideHistory] = useState();

  const [reviewUser, setReviewUser] = useState();
  const [users, setUsers] = useState();

  const requestAction = (objectId, type) => {

    objectId.type = type;

    axios.post("http://localhost:6969/adminRequestAction", objectId)
      .then(res => {

        if (res.data.message == "Successfully Updated") {

          if (type == 1)  // Accepting Request
          {
            alert("Request sent to Driver successfully");
          }
          else if (type == 2)   // Rejecting Request
          {
            alert("Request Rejected succefully");
          }

          //document.getElementById(driverId).disabled = true;
        }
        else {
          alert(res.data.message)
        }
        //console.log(res)

      }
      )

  }


  const getRequests = () => {

    axios.get('http://localhost:6969/adminpendingrequests').then(res => {

      if (res.data.success) {

        var i = 0;

        var ridevalues = res.data.rideBookings;

        axios.get('http://localhost:6969/users').then(res1 => {

          if (res1.data.success) {

            var users = res1.data.users;

            ridevalues.forEach(element => {

              users.forEach(element1 => {

                if (element.userId == element1._id) {
                  ridevalues[i].username = element1.name;
                }

                if (element.driverId == element1._id) {
                  ridevalues[i].drivername = element1.name;
                }

              });

              i++;

            });

            setRides(ridevalues);

          }

        })

      }
    })

  }

  const getReviewsss = () => {
    console.log("DING DING DIGAA DIGAADING");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getReviewsss();
      getRequests();
      getReviews();
      getUsers();
      getRideHistoryAdmin();

    }, 1000);
    // getRequests();
  }, []);

  //   useEffect(() => {
   
  //     getReviewsss();
  //     getRequests();
  //     getReviews();
  //     getUsers();
  //     getRideHistoryAdmin();

    
  //   // getRequests();
  // }, []);



  const getReviews = () => {

    axios.get('http://localhost:6969/userreviews').then(res => {

      //console.log("review coming", res.data.reviewpost);

      var reviews = res.data.reviewpost;

      var i = 0;

      reviews.forEach(element => {

        //console.log("Element", element);

        if (element.driverId) {
          reviews[i].driverId = element.driverId.name;
        }
        else {
          reviews[i].driverId = "";
        }

        i++;

      });

      //console.log("kjkjk", reviews);

      setReviewUser(reviews);

      //console.log("kjkjk", reviewUser);

    })

  }

  const getUsers = () => {

    axios.get('http://localhost:6969/users').then(res1 => {

      if (res1.data.success) {

        const users = res1.data.users;
        setUsers(users);
        //console.log("usersss", users);

      }

    })
  }

  const getRideHistoryAdmin = () => {

    axios.get('http://localhost:6969/adminhistory').then(res => {

      if (res.data.success) {
        //setUsers(res.data.users);
        var i = 0;
        var ridevalues = res.data.rideBookings;

        axios.get('http://localhost:6969/users').then(res1 => {

          if (res1.data.success) {

            var users = res1.data.users;

            ridevalues.forEach(element => {

              if (ridevalues[i].createdDate != undefined)
                ridevalues[i].createdDate = ridevalues[i].createdDate.replace("T", " ");
              users.forEach(element1 => {
                if (element.driverId == element1._id) {
                  ridevalues[i].drivername = element1.name;
                }
              });

              i++;
            });
            setRideHistory(ridevalues);
          }

        })

      }
    })

  }

  return (
    <>
      <Header />

      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <div className="d-flex ">
          <Col sm={2} md={2} lg={1} xl={1} className="tabs-nav-admin">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first" className="icon-nav"><i class="fa-solid fa-envelope"></i></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second" className="icon-nav"><i class="fa-solid fa-user"></i></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third" className="icon-nav"><i class="fa-solid fa-clock-rotate-left"></i></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fourth" className="icon-nav"><i class="fa-solid fa-star"></i></Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={10}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <div className="d-flex request-from-users">
                  <div className="col-lg-12 col-xl-12 col-sm-12 col-xs-12 col-12">

                    <div className='request-cabdriver mt-50'>
                      <h1> Pending Requests </h1>
                    </div>
                    <Table striped className='request-cabdriver mt-50'>
                      <thead className="table-heading-admin">
                        <tr>
                          <th>Request ID</th>
                          <th>User</th>
                          <th>Place</th>
                          <th>Driver Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          rides != undefined ? (
                            rides.map(rides =>
                              <tr key={rides._id}>
                                <td>{rides._id}</td>
                                <td>{rides.username}</td>
                                <td>{rides.toLocation}</td>
                                <td>{rides.drivername}</td>
                                <td>
                                  <div className='action-btn-flex'>
                                    <button className='action-btn color-green' title='Accept this Request'
                                      onClick={() => { requestAction(rides, 1) }}>
                                      <i className="fa fa-check"></i>
                                    </button>
                                    <button className='action-btn color-red' title='Reject this Request'
                                      onClick={() => { requestAction(rides, 2) }}>
                                      <i className="fa fa-close"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          )
                            : (
                              <tr><td colSpan={5}> No Requests available </td></tr>
                            )
                        }
                      </tbody>
                    </Table>
                  </div>
                </div>

              </Tab.Pane>
              <Tab.Pane eventKey="second">

                <div className="d-flex request-from-users">
                  <div className="col-lg-12 col-xl-12 col-sm-12 col-xs-12 col-12">

                    <div className='request-cabdriver mt-50'>
                      <h1> Users </h1>
                    </div>
                    <Table striped className='request-cabdriver mt-50'>
                      <thead className="table-heading-admin">
                        <tr>
                          <th>User Id</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>City</th>
                          <th>Role</th>
                          <th>Location</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          users != undefined ? (
                            users.map(users =>
                              <tr key={users._id}>
                                <td>{users._id}</td>
                                <td>{users.name}</td>
                                <td>{users.email}</td>
                                <td>{users.city}</td>
                                <td>{users.role}</td>
                                <td>{users.address}</td>

                                <td>
                                  <div className='action-btn-flex'>
                                    <button className='action-btn color-green' title='Accept this Request'
                                      onClick={() => { requestAction(rides, 1)}}>
                                      <i className="fa fa-check"></i>
                                    </button>
                                    <button className='action-btn color-red' title='Reject this Request'
                                      onClick={() => { requestAction(rides, 2)}}>
                                      <i className="fa fa-close"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          )
                            : (

                              <tr><td colSpan={5}> No Requests available </td></tr>
                            )
                        }
                      </tbody>
                    </Table>
                  </div>
                </div>

              </Tab.Pane>
              <Tab.Pane eventKey="third">

                <div className='request-cabdriver mt-50'>
                  <h1> History</h1>


                  <Table className="history-table">
                  <thead className='table-heading-admin'>
                    <tr className='driver-accept'>

                      {/* <th> <div className='user-icon'>
                      <img src={avataricon} alt="" className="avatar-icon" />

                      </div>
                      </th> */}
                      <th>Id</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Driver Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      rideHistory != undefined ? (
                        rideHistory.map(rideHistory =>
                          <tr>
                            <td>
                              {rideHistory._id}
                            </td>
                            <td>
                              {rideHistory.createdDate}
                            </td>
                            <td>
                              {rideHistory.toLocation}
                            </td>
                            <td>
                              {rideHistory.drivername}
                            </td>
                            <td>
                              {(() => {
                                if (rideHistory.rideStatus == 0) {
                                  return (
                                    <div>
                                      <span className="ride-requested"> Ride Requested </span>
                                    </div>
                                  )
                                } else if (rideHistory.rideStatus == 1) {
                                  return (
                                    <div>
                                      <span className='ride-accepted' > Ride Accepted </span>
                                    </div>
                                  )
                                }
                                else if (rideHistory.rideStatus == 2) {
                                  return (
                                    <div>
                                      <span className="ride-requested"> Ride Rejected </span>
                                    </div>
                                  )
                                }
                                else if (rideHistory.rideStatus == 3 ) {
                                  return (
                                    <div>
                                      <span  className="ride-completed" > Ride Completed </span>
                                     
                                    </div>
                                  )
                                }
                                
                                else if (rideHistory.rideStatus == 4) {
                                  return (
                                    <div>
                                      <span className="ride-cancelled">Ride Cancelled </span>
                                    </div>
                                  )
                                }
                                else if (rideHistory.adminApproveStatus == 4) {
                                  return (
                                    <div>
                                      <span className='ride-cancelled'>Admin Rejected </span>
                                    </div>
                                  )
                                }
                              })()}
                            </td>
                          </tr>
                        )) : (
                        <>No data</>
                      )}

                  </tbody>
                </Table>




                </div>

              </Tab.Pane>
              <Tab.Pane eventKey="fourth">
                <>

                  <div className="d-flex request-from-users">
                    <div className="col-lg-12 col-xl-12 col-sm-12 col-xs-12 col-12">
                      <div className='request-cabdriver mt-50'>
                        <h1> User Reviews</h1>
                      </div>
                      <Table striped className='request-cabdriver mt-50'>
                        <thead className="table-heading-admin">
                          <tr>
                            <th>Ride ID</th>
                            <th>Name</th>
                            <th>Review</th>
                            <th>Driver Name</th>
                            {/* <th>Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {
                            reviewUser != undefined ? (
                              reviewUser.map(reviewUser =>
                                <tr key={reviewUser._id}>
                                  <td>{reviewUser._id}</td>
                                  <td>{reviewUser.name}</td>
                                  <td>{reviewUser.comments}</td>
                                  <td>{reviewUser.driverId}</td>
                                  {/* <td>
                                <div className='action-btn-flex'>
                                  <button className='action-btn color-green' title='Accept this Request'
                                    onClick={() => { requestAction(rides, 1) }}>
                                    <i className="fa fa-check"></i>
                                  </button>
                                  <button className='action-btn color-red' title='Reject this Request'
                                    onClick={() => { requestAction(rides, 2) }}>
                                    <i className="fa fa-close"></i>
                                  </button>
                                </div>
                              </td> */}
                                </tr>
                              )
                            )
                              : (

                                <tr><td colSpan={5}> No Requests available </td></tr>
                              )
                          }
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </>

              </Tab.Pane>
            </Tab.Content>
          </Col>
        </div>
      </Tab.Container>

    </>
  )
}

export default AdminDashboard