import React, { useState, filter, useEffect } from 'react'
import './userdashboard.css';
import axios from 'axios';
import Header from './Header';
import 'font-awesome/css/font-awesome.min.css';
import DirectionMap from '../DirectionMap/DirectionMap';

import avataricon from '../../images/profile.png';

const CabDriverDashboard = () => {

  const [rides, setRides] = useState();

  const requestAction = (objectId, type) => {

    //console.log("Object Id", objectId);

    //alert(driverId);

    objectId.type = type;

    axios.post("http://localhost:6969/driverRequestAction", objectId)
      .then(res => {

        if (res.data.message == "Successfully Updated") {

          if (type == 1)  // Accepting Request
          {
            alert("Request Accepted successfully");
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

  const getDriverRequests = () => {

    axios.get('http://localhost:6969/driverpendingrequests').then(res => {

      if (res.data.success) {

        //console.log("Drive Details", res.data.rideBookings);

        //setUsers(res.data.users);
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

  useEffect(() => {
    const interval = setInterval(() => {
      getDriverRequests();
    }, 1000);
    // getRequests();
  }, []);


  const [complete, setComplete] = useState();

  const completeride = (rides, event) => {

    var values = event.target.value;


    
      const confirmBox = window.confirm(
        "Do you really want to complete this ride?"
      )
      if (confirmBox === true) {
        // completeride(rides, event)
        requestAction(rides, values)
      }
  

    // console.log("valuess", values);
    // alert(values);
   

    //alert(element.selected.value);
  }

  return (
    <>
      <Header />

      <div className='request-cabdriver mt-50'>
        <h1> Requests for a ride </h1>
      </div>

      <div className='d-flex cab-driver-list'>

        <div className='col-md-6 col-xl-6 col-lg-6 col-xs-12 col-sm-12 col-12'>
          <div>
            {
              rides != undefined ? (
                rides.map(rides =>
                  <div className='cab-driver-name' key={rides._id} id={rides._id}>
                    <div className='driver-name'>
                      <p>{rides._id}</p>

                    </div>

                    <div className='user-icon'>
                      <img src={avataricon} alt="" className="avatar-icon" />
                    </div>

                    <div className='driver-name'>
                      <p>{rides.username}</p>

                    </div>
                    <div className='driver-name'>
                      <p>{rides.toLocation}</p>

                    </div>

                    {(() => {
                      if (rides.rideStatus == 0) {
                        return (
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
                        )
                      } else if (rides.rideStatus == 1) {
                        return (
                          <div>
                            <select id="completestatus" className='form-control' value={complete} onChange={(event) => completeride(rides, event)} >
                              <option value="1" selected > Inprogress </option>
                              <option value="3" > Complete Ride </option>
                              <option value="4"  > Cancel Ride </option>
                            </select>
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
                      else if (rides.rideStatus == 3) {
                        return (
                          <div>
                            <span className='ride-completed'> Ride Completed </span>
                          </div>
                        )
                      }
                      else if (rides.rideStatus == 4) {
                        return (
                          <div>
                            <span className='ride-cancelled'> Ride Cancelled </span>
                          </div>
                        )
                      }
                      else {
                        return (
                          <div>
                            <span className='ride-completed'> Ride Completed </span>
                          </div>
                        )
                      }
                    })()}

                  </div>
                )) : (
                <div className='cab-driver-name'>Accept the requests from customers....</div>
              )}
          </div>
        </div>
        <div className='col-md-6 col-xl-6 col-lg-6 col-xs-12 col-sm-12 col-12'>
        <DirectionMap/>
        </div>

      </div>
    </>
  )
}

export default CabDriverDashboard