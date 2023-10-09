import React, { useEffect, useState } from 'react';
import { Form, useActionData } from 'react-router-dom';

import axios from 'axios';
import { ENDPOINTS, mock, useFetchedData, useIsLoading } from '../../common/utilities';

import ManagerSelect from './components/ManagerSelect';
import RoleDesc from './components/RoleDesc';
import RoleSelect from './components/RoleSelect';
import SkillCard from './components/SkillCard';
import CountrySelect from './components/CountrySelect';

import moment from 'moment';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';

import StatusToast from '../../common/StatusToast';
import { SubmitButton } from '../../common/SubmitButton';
import { useNow } from '../../common/utilities';

import DateRangePicker from './components/DateRangePicker';

export type Role = {
  role_name: string,
  role_desc: string,
  role_skills: string[]
};

interface IFormData {
  role_name: string;
  start_date: string;
  end_date: string;
  rep_manager_id: number;
  country: string
}


// mock?.onPost(ENDPOINTS.listings).reply(200, {
//   success: false
// });

// Form submit action
export async function createListingAction({ request, method="post" }) {
  const formData = await request.formData();

  // copy of formData
  let body = { ...Object.fromEntries(formData) };

  // extract fields to prevent injection
  const { role_name, start_date, end_date, country, rep_manager_id } = body;
  body = {
    role_name,
    rep_manager_id,
    country,
    start_date: moment(start_date).format("YYYY-MM-DD"),
    end_date: moment(end_date).format("YYYY-MM-DD"),

  } as IFormData;

  console.table(body);

  const actionData = {
    time: moment(),
    success: false,
    message: ""
  }
  // Post form response to axios
  try {
    const createListingResponse = await axios(
      ENDPOINTS.listings,
      {method, ...body},
    )
    actionData.success = true;
    actionData.message = `${method == "post" ? "Submission": "Edit"} of ${body.role_name} successful!`;

    return actionData;
  }
  catch (responseErr) {
    console.log(responseErr.message);
    actionData.message = `${method == "post" ? "Submission": "Edit"} of ${body.role_name} failed: ${responseErr.message}!`;

    return actionData;
  }

}

function fetchRoles(): Promise<Role[]> {
  return axios.get(ENDPOINTS.roles)
    .then(response => response.data.roles);
}

function fetchStaffs() {
  return axios.get(ENDPOINTS.staffs)
    .then(response => response.data.staff);
}


export default function ListingForm() {

  // const [formData, setformData] = useState({
  //   role_name: "",
  //   start_date: null,
  //   end_date: null
  // })

  // start and end date should be null at the start?
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // create roleData state variable and get data to set roleData
  const [roleData, setRoleData] = useState<Role[] | []>([]);
  const [repManagerData, setRepManagerData] = useState();

  useFetchedData({ fetchFn: fetchRoles, setState: setRoleData });
  useFetchedData({ fetchFn: fetchStaffs, setState: setRepManagerData });

  const [selectedRole, setSelectedRole] = useState<Role>({
    role_name: "",
    role_desc: "No role selected.",
    role_skills: []
  });

  const formActionData = useActionData();
  const [showToast, setShowToast] = useState(false);

  // Get current time: updated every 1s
  const now = useNow();

  const isLoading = useIsLoading();

  // if formActionData present
  useEffect(() => {
    formActionData && setShowToast(true);
  }, [formActionData])


  return (
    <>

      <StatusToast
        showToast={showToast}
        setShowToast={setShowToast}
        now={now}
        actionData={formActionData} />

      {/* <h3>Create Listing</h3> */}

      <Form action="/listings/new" method="post">


        <Container className="p-0">
          <h4 className='my-4'>Role Details</h4>
          <Row>
            <Col>
              <RoleSelect
                setSelectedRole={setSelectedRole}
                roleData={roleData}
              // formData={formData}
              // setRoleName={setformData}
              />
            </Col>
          </Row>
          <Row >
            <Col sm={6} className='mt-3'>
              <RoleDesc selectedRole={selectedRole} />
            </Col>
            <Col sm={6} className='mt-3'>
              <SkillCard
                selectedRole={selectedRole}
              />
            </Col>
          </Row>

          <h4 className='my-4'>Listing Details</h4>

          <Row>
            <ManagerSelect repManagerData={repManagerData} />
            <CountrySelect />
          </Row>

          <Row className='mt-3'>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              setStartDate={(date) => setStartDate(new Date(date))}
              setEndDate={(date) => setEndDate(new Date(date))}
            />
          </Row>

          <Row className='mt-3'>
            <Col>
              <SubmitButton isLoading={isLoading}></SubmitButton>
            </Col>
          </Row>

        </Container>


      </Form>
    </>
  )
}





