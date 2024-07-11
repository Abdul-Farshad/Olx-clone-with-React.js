import React from 'react';

import Signup from '../Components/Signup/Signup';
import WithNoAuth from '../Components/withAuth/WithNoAuth';
function SignupPage() {
  return (
    <div>
      <Signup />
    </div>
  );
}

export default WithNoAuth(SignupPage);
