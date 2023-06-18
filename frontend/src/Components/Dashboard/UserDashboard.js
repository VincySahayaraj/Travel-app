import React, { useState, filter, useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './userdashboard.css';
import { BsSearch } from 'react-icons/bs';
import axios from 'axios';
import Header from './Header';
import caricon from '../../images/car.png';
import Table from "react-bootstrap/Table";
import avataricon from '../../images/profile.png';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import DirectionMap from '../DirectionMap/DirectionMap';
function UserDashboard() {


  const [users, setUsers] = useState();
  const [searchcity, setSearchcity] = useState();


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {

    setShow(true);
  }

  //filter function for searching
  // const filterContent = (users, searchTerm) => {
  //   console.log(users)
  //   const result = users.users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  //   console.log(result)
  //   // this.setState({ users: result });
  //   setUsers(result);
  // }

  //Search Function
  const handleTextSearch = (event) => {

    setSearchcity(event.currentTarget.value);

  };

  const searchDrivers = () => {

    axios.post(`http://localhost:6969/drivers/${searchcity}`).then(res => {

      //console.log(res.data)

      if (res.data.success) {
        // filterContent(res.data, searchTerm)
        setUsers(res.data.users);
        //console.log("cab drivers", users)

      }
    })

  }

  const sendRequestToDrivers = (driverId) => {
    //alert(driverId);

    const rideBook = {
      driverId: driverId,
      toLocation: searchcity,
    }

    axios.post("http://localhost:6969/sendrequest", rideBook)
      .then(res => {

        if (res.data.message == "Request sent successfully") {
          document.getElementById(driverId).disabled = true;
        }
        else {
          alert(res.data.message)
        }
        //console.log(res)

      }
      )
    // axios.post(`http://localhost:6969/sendrequest`).then(res => {


    //   console.log(res.data)

    //   if (res.data.success) {
    //     // filterContent(res.data, searchTerm)
    //     setUsers(res.data.users);
    //     console.log("cab drivers", users)

    //   }
    // })

  }


  const showhistorycontent = () => {

    setShowDriver(!showDriver);
    setShowHistory(!showHistory);

  }
  const [showDriver, setShowDriver] = useState(true);
  const [showHistory, setShowHistory] = useState(false);


  const [review, setReview] = useState({
    name: "",
    comments: ""
  });
  const [rides, setRides] = useState();



  const getRideHistory = () => {

    axios.get('http://localhost:6969/userridehistory').then(res => {

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
            setRides(ridevalues);
          }

        })

      }
    })

  }
  useEffect(() => {
    const interval = setInterval(() => {
      getRideHistory();
    }, 1000);
    // getRequests();
  }, []);


  const handleChangeReview = e => {
    const { name, value } = e.target
    setReview({
      ...review,//spread operator 
      [name]: value
    })

  }

  const handlePost = (trackId,driverId) => {
    const { name, comments } = review;
    review.trackId = trackId;
    review.driverId = driverId;
    //console.log("hlo", review)
    if (name && comments) {
      axios.post("http://localhost:6969/postreview", review)
        .then(res => {

          if (res.data.message == "successfully posted") {

            handleClose();

          }
          else {
            alert(res.data.message)
          }
          //console.log(res)

        }
        )

    }
    else {
      alert("invalid input")
    };
  }


  return (
    <>
      {/* <Navbar className="nav-header">
      <Container>
        <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar> */}
      <Header />

      {showHistory && (
        <>
          <div className='history-btn'>
            <button className='see-history' onClick={showhistorycontent}>Search for drivers...</button>
          </div>
          <div className='d-flex accepted-requests'>
            <div className='col-md-12 col-xl-12 col-lg-12 col-xs-12 col-sm-12'>
              <div className='box-history'>

                <Table>
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
                      rides != undefined ? (
                        rides.map(rides =>
                          <tr>
                            <td>
                              {rides._id}
                            </td>
                            <td>
                              {rides.createdDate}
                            </td>
                            <td>
                              {rides.toLocation}
                            </td>
                            <td>
                              {rides.drivername}
                            </td>
                            <td>
                              {(() => {
                                if (rides.rideStatus == 0) {
                                  return (
                                    <div>
                                      <span className="ride-requested"> Ride Requested </span>
                                    </div>
                                  )
                                } else if (rides.rideStatus == 1) {
                                  return (
                                    <div>
                                      <span className='ride-accepted' > Ride Accepted </span>
                                    </div>
                                  )
                                }
                                else if (rides.rideStatus == 2) {
                                  return (
                                    <div>
                                      <span className="ride-rejected"> Ride Rejected </span>
                                    </div>
                                  )
                                }
                                else if (rides.rideStatus == 3 && rides.isReviewPost==true) {
                                  return (
                                    <div>
                                      <span  className="ride-completed" > Ride Completed </span>
                                      <Button variant="primary" className='review-posted' disabled>
                                        Review posted
                                      </Button>
                                    </div>
                                  )
                                }
                                else if (rides.rideStatus == 3) {
                                  return (
                                    <div>
                                      <span  className="ride-completed"> Ride Completed </span>

                                      <Button className='review-post' variant="primary" onClick={handleShow}>
                                        Write your review
                                      </Button>

                                      <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                          <Modal.Title>Post a Review</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                          <Form>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" >
                                              <Form.Label>Your Name</Form.Label>
                                              <Form.Control
                                                type="text"
                                                placeholder="name@example.com"
                                                autoFocus
                                                name="name"
                                                value={review.name} onChange={handleChangeReview}

                                              />
                                            </Form.Group>
                                            <Form.Group
                                              className="mb-3"
                                              controlId="exampleForm.ControlTextarea1"

                                            >
                                              <Form.Label>Write comments</Form.Label>
                                              <Form.Control as="textarea" rows={3} name="comments" value={review.comments} onChange={handleChangeReview} />
                                            </Form.Group>
                                          </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                          <Button variant="secondary" onClick={handleClose}>
                                            Close
                                          </Button>
                                          <Button variant="primary" onClick={() => handlePost(rides._id,rides.driverId)} >
                                            Post
                                          </Button>
                                        </Modal.Footer>
                                      </Modal>

                                    </div>
                                  )
                                }
                                else if (rides.rideStatus == 4) {
                                  return (
                                    <div>
                                      <span className="ride-cancelled" > Ride Cancelled </span>
                                    </div>
                                  )
                                }
                                else if (rides.adminApproveStatus == 4) {
                                  return (
                                    <div>
                                      <span style={{ backgroundColor: "orange", color: "white" }}> Admin Rejected </span>
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

                {/* {
              rides != undefined ? (
                rides.map(rides => */}
                {/* <div className='cab-driver-name'>
                    <div className='user-icon'>
                      <img src={avataricon} alt="" className="avatar-icon" />
                    </div>

                    <div className='driver-name'>
                  
                      <p>dfdfdfdf</p>
                    </div>
                    <div className='action-btn-flex'>
                      <button className='action-btn color-green' title='Accept this Request'
                       >
                        <i className="fa fa-check"></i>
                      </button>
                      <button className='action-btn color-red' title='Reject this Request'
                       >
                        <i className="fa fa-close"></i>
                      </button>
                    </div>
                  </div> */}
                {/* )) : ( */}
                {/* <div className='cab-driver-name'>Accept the requests from customers....</div> */}
                {/* )} */}
              </div>
            </div>
          

          </div>




        </>

      )}

      {showDriver && (
        <>
          <div className="search-bar">
            {/* <label>Search Here <BsSearch /></label>&nbsp; */}
            <input type="search"
              placeholder="search..."
              name='searchTerm'
              className='searchterm'
              onChange={handleTextSearch} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button className='search-btn' onClick={searchDrivers}>search</button>

          </div>
          <div className='history-btn'>
            <button className='see-history' onClick={showhistorycontent} >See History</button>
          </div>

          <div className='d-flex cab-driver-list'>

            <div className='col-xl-6 col-lg-6 col-xs-12 col-sm-12 col-12'>
              <div className='drivers-available'>
                {
                  users != undefined ? (
                    users.map(users =>
                      <div className='cab-driver-name' key={users._id}>
                        <img src={caricon} className="car-icon-cab" />
                        <div className='driver-name'>{users.name}</div>
                        <button className='req-btn' id={users._id}
                          onClick={() => { sendRequestToDrivers(users._id) }}>Request</button>
                      </div>
                    )) : (
                    <div className='cab-driver-name'>Search city to see available drivers here....</div>
                  )}
              </div>
            </div>
            <div className='col-xl-6 col-lg-6 col-xs-12 col-sm-12 col-12'>
              <DirectionMap/>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default UserDashboard;