import React from 'react';
import { Form } from 'react-bootstrap';
import Select, { components } from 'react-select';

// Type Definitions ||
import type { Role } from '../ListingForm';

type Data = {
  roles: Role[];
}

// Component ||
export default function RoleSelect({ setSelectedRole, roleData }) {
  return (
    <>
      <Form.Label htmlFor="role_name">
        Role Name <span className='text-danger'>*</span> 
      </Form.Label>

      <Select
        className="basic-single"
        classNamePrefix="select"
        isSearchable={true}
        placeholder="Select Role..."
        name="role_name"
        id="role_name"
        options={roleData}
        getOptionLabel={role => role.role_name}
        getOptionValue={role => role.role_name}
        // components={{ Option: customOption }}
        onChange={value => {
          setSelectedRole(value)
        }}
        required
      />

      {/* <label className="form-text">Filter roles by typing...</label> */}
    </>
  )
}
