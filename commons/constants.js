const CONSTANTS = {
  REQUEST_CODES: {
    SUCCESS: 'Success',
    FAIL: 'Error',
    FAIL_MSG: 'Please Contact Technical Support, ERRORCODE : {1}',
    WARNING: 'Warning',
    MISSING_MANDATORY: 'Missing mandatory fields',
    NO_DATA_FOUND: 'No Data Found'
  },
  AZURE_CODES: {
    CONTAINER_NAME: 'spikeview-media',
    DOWNLOAD_LINK_MSG: 'Download link created',
    SASKEY_SUCCESS_MSG: 'SAS Key generated'
  },
  VALIDATE: {
    FAIL: 'Validation Error',
    FIELD_VALUE_INVALID: 'field {0} value is invalid',
    REQUIRED: 'field {0} is required',
    NOT_A_DATE: 'field {0} is not a valid Date',
    NOT_AN_EMAIL: 'Please enter a valid Email address',
    NOT_A_PHONE: 'field {0} is not a valid phone value',
    NOT_A_MOBILE_PHONE: '{0} is not a valid mobile phone value for field {1}',
    NOT_A_INTEGER: '{0} is not a valid integer value for field {1}',
    NOT_A_NUMBER: 'field {0} is not a valid number',
    NOT_A_VALUE: "field {0} can't be empty",
    NOT_A_VALID_GENDER: '{0} is not a valid gender type',
    VALUE_TOO_BIG: 'field {0} data is too large'
  },
  USERS: {
    BOTID: 1,
    GET_API: 'USER0001',
    POST_API: 'USER0002',
    PUT_API: 'USER0003',
    PASSWORD_PREFIX: 'Ts4Yu$',
    CREATE_SUCCESS: 'User created with userId {0}',
    CREATE_SUCCESS_ROLE: 'Thank you for signing up, please check your inbox for login credentials.',
    CREATE_SUCCESS_ROLE_FOLLOW_UP: 'Thank you for signing up, please check your inbox for login credentials. Follow up with your parents to approve your account from their email',
    DELETE_SUCCESS: 'User with userId {0} removed',
    UPDATE_SUCCESS: 'User updated',
    ARCHIVE_SUCCESS: 'User archived',
    ACTIVATE_USER: 'User activated',
    DETACHED_STUDENT: 'Student removed',
    ALREADY_PARENT_OF_THIS_STUDENT: 'You are already registered with spikeview as parent of this student. Please log in with your existing credentials. If you do not have your account information, please try to reset password.',
    USER_FOUND_WITH_OTHER_ROLE: 'You are already registered with another role. Please log in with your existing credentials. If you do not have your account information, please try to reset password.',
    DEACTIVATE_USER: 'User deactivated',
    UPDATE_FAIL: 'User with userId {0} already exists',
    CHANGE_PASSWORD_SUCCESS: 'Your password has been changed',
    CHANGE_PASSWORD_FAILED: 'Unable to change the password',
    OLD_PASSWORD_NOT_MATCHED: 'Incorrect old password',
    OLD_AND_NEW_PASSWORD_SAME: 'Your current and new password cannot be the same',
    PASSWORD_RESET_SUCCESS: 'Your password has been reset - please check your email inbox for next steps.',
    PASSWORD_RESET_FAILED: 'User with userId {0} password reset failed',
    EMAIL_NOT_EXIST: "Oops, we don't recognize that email. Please try again.",
    RESET_PASSWD_GUEST: 'You cannot reset a password until you have valid account. Please Sign Up and try again.',
    EMAIL_EXIST: 'Email {0} address is already in use. Please log in with your existing credentials. If you do not have your account information, please try to reset password.',
    STUDENT_MANDATE: 'Student email is required',
    STUDENT_PARENT_EMAIL: 'Both the emails cannot be same, please change either one.',
    STUDENT_ROLE: 1,
    PARENT_ROLE: 2,
    GUEST_ROLE: 3,
    PARTNER_ROLE: 4,
    USER_NOT_FOUND: 'User with userId {0} not found in the system',
    PARENT_ALREADY_LINKED: 'Parent email {0} already linked',
    PARENT_ALREADY_EXIST: 'Parent email {0} already in use with other role.',
    PARENT_ALREADY_EXIST_WITH_OTHER_ROLE: 'Email {0} is already in use. Please log in with your existing credentials else, please try to reset password.',
    ADD_FROM_PROFILE: 'You are already registered: Please log in and add this student from your profile else, please try to reset password.',
    INFORM_PARENT: 'Your child already has an account, so you will need to be added as a parent from their existing account.',
    STUDENT_ALREADY_LINKED: 'Student {0} is already linked to your profile',
    STUDENT_ALREADY_EXIST_PLEASE_ASK_TO_ADD: 'Student {0} is already registered: Please ask them to add you to their profile.',
    STUDENT_NOT_FOUND: 'Student not found in spikeview.',
    STUDENT_ADDED: 'Student was added',
    STUDENT_FETCHED_SUCCESS: 'Student fetched',
    STUDENT_MININUM_REQUIRED_AGE: 13,
    DELETE_PARENT_FOR_13YEAR_LESS_STUDENT: 'Being a minor, student must need at least one parent attached with.',
    PARENT_EMAIL_MANDATE: 'Parent email is required',

    CHILD_ACTIVATION_MESSAGE: "Your child's spikeview profile is now active. You can use this parent portal to add other children or help manage your child's profile",
    ALREADY_SELECTED_ROLE: 'Your role is already selected'
  },
  ORGANIZATIONS: {
    GET_API: 'ORGANIZATION0001',
    POST_API: 'ORGANIZATION0002',
    PUT_API: 'ORGANIZATION0003',
    TYPE_SCHOOL: 'School',
    TYPE_UNIVERSITY: 'University',
    CREATE_SUCCESS: 'User created with organizationId {0}',
    DELETE_SUCCESS: 'User with organizationId {0} removed',
    UPDATE_SUCCESS: 'User with organizationId {0} updated',
    UPDATE_FAIL: 'User with organizationId {0} already exists'
  },
  ASSETS: {
    CREATE_SUCCESS: 'User created with assetId {0}',
    DELETE_SUCCESS: 'User with assetId {0} removed',
    UPDATE_SUCCESS: 'User with assetId {0} updated',
    UPDATE_FAIL: 'User with assetId {0} already exists'
  },
  REPORT: {
    CREATE_SUCCESS: 'Report has been registered',
    DELETE_SUCCESS: 'Report removed',
    UPDATE_SUCCESS: 'Report has been updated',
    UPDATE_FAIL: 'Report already exists'
  },
  REPORT_TYPE: {
    FEED: 'Feed',
    GROUPFEED: 'GroupFeed',
    GROUP: 'Group',
    PROFILE: 'Profile'
  },
  EDUCATION: {
    GET_API: 'EDUCATION0001',
    POST_API: 'EDUCATION0002',
    PUT_API: 'EDUCATION0003',
    CREATE_SUCCESS: 'Education details added',
    DELETE_SUCCESS: 'Education details removed',
    UPDATE_SUCCESS: 'Education details updated',
    UPDATE_FAIL: 'educationId {0} already exists',
    NOT_A_VALID_EDUCATION: 'Please double check your grade and date ranges for errors.'
  },
  ACHIEVEMENT: {
    GET_API: 'ACHIEVEMENT0001',
    POST_API: 'ACHIEVEMENT0002',
    PUT_API: 'ACHIEVEMENT0003',
    CREATE_SUCCESS: 'Achievement added',
    DELETE_SUCCESS: 'Achievement removed',
    UPDATE_SUCCESS: 'Achievement updated',
    UPDATE_FAIL: 'Achievement already exists',
    NOT_IN_RANGE: 'Please select a number between 0 to 10'
  },
  LOGIN: {
    TOKEN_PREFIX: 'Spike',
    TOKEN_FAILED: 'Token generation failed',
    NO_PASSWORD: 'Password not provided',
    NO_EMAIL: 'Email not provided',
    NO_CREDENTIALS: 'Credentials not provided',
    INVALID_CREDENTIALS: "Your login credentials don't match our records. If you do not have your account information, please try to reset password.",
    LOGIN_SUCCESS: 'You are logged in',
    LOGOUT_SUCCESS: 'You are logged out',
    USER_NOT_REGISTERED: "Your login credentials don't match our records. If you do not have your account information, please try to reset password, or register with a new email address.",
    USER_ARCHIVED: 'This account has been removed: Please contact Technical Support if you have any questions.',
    INACTIVE_USER: 'Inactive user',
    INVALID_TOKEN: 'Invalid Token'
  },
  ROLE_TYPE: {
    CREATE_SUCCESS: 'Role Type created with roleTypeId {0}',
    UPDATE_SUCCESS: 'Role Type with roleTypeId {0} updated',
    DELETE_SUCCESS: 'Role Type with roleTypeId {0} removed'
  },
  ADDRESS: {
    CREATE_SUCCESS: 'Address created with addressId {0}',
    DELETE_SUCCESS: 'Address with addressId {0} removed',
    UPDATE_SUCCESS: 'Address with addressId {0} updated'
  },
  PROFILE: {
    UPDATE_SUCCESS: 'Profile successfully updated',
    EXISTING_PARENT: 'You already have an account: You can add this parent only from your childs',
    ADD_PARENT_SUCCESS: 'New parent added.'
  },
  AUTHORIZATION: {
    TOKEN_VERIFICATION_FAILED: 'Authorization Failed.',
    TOKEN_VERIFICATION_PASSED: 'Authorization Success.'
  },
  EMAIL: {
    EMAIL_SUCCESS: 'Email sent',
    EMAIL_FAILED: 'Email failed!',
    CREATE_USER: 'create_user',
    CREATE_PARENT_USER: 'create_parent_user',
    CREATE_USER_WITH_INFORM: 'create_user_inform',
    RESET_PASSWORD: 'reset_password',
    INFORM_STUDENT: 'informStudent',
    INFORM_PARENT: 'inform_parent',
    RECOMMENDATION_REQUEST: 'recommendation_request',
    SHARE_PROFILE: 'share_profile',
    GROUP_JOINING_REQUEST: 'join_group',
    ADD_STUDENT: 'addStudent',
    ADD_PARENT_BY_STUDENT: 'add_parent_by_student',
    ADD_PARENT_BY_PARENT: 'add_parent_by_parent',
    REMINDER_EMAIL_ALERTS: 'inform_parent_to_activate_student_account',
    THANK_YOU_EMAIL: 'thank_you_email',
    STUDENT_ACTIVATED_BY_PARENT: 'student_activated_by_parent',
    FOLLOW_UP_PARENT: 'follow_up_parent',
    STUDENT_ACTIVE_LOGIN: 'student_active_login',
    ADMIN_REPORT_MAIL: 'admin_report_mail',
    EMAIL_ALREADY_EXIST: 'Email is already registered.',
    THANK_YOU_MESSAGE: 'Thank you for your valuable time to respond us.',
    GUEST_TO_STUDENT_ACCOUNT_CONVERSION: 'guest_to_student_accont_conversion',
    GUEST_ACCOUNT_CREATION_EMAIL_MESSAGE: 'Welcome to spikeview! Please login with the credentials below to start creating your unique narrative.'
  },
  COMPETENCY: {
    GET_API: 'COMPETENCY0001',
    POST_API: 'COMPETENCY0002',
    PUT_API: 'COMPETENCY0003',
    CREATE_SUCCESS: 'Competency Type created with competencyTypeId {0}',
    UPDATE_SUCCESS: 'Competency Type with competencyTypeId {0} updated',
    DELETE_SUCCESS: 'Competency Type with competencyTypeId {0} removed'
  },
  SKILLS: {
    CREATE_SUCCESS: 'Skill created with skillId {0}',
    DELETE_SUCCESS: 'Skill with skillId {0} removed',
    UPDATE_SUCCESS: 'Skill with skillId {0} updated',
    UPDATE_FAIL: 'Skill with skillId {0} already exists',
    NOT_FOUND: 'Master skills set not found.'
  },
  IMPORTANCE: {
    CREATE_SUCCESS: 'Importance created with importanceId {0}',
    DELETE_SUCCESS: 'Importance with importanceId {0} removed ',
    UPDATE_SUCCESS: 'Importance with importanceId {0} updated',
    UPDATE_FAIL: 'Importance with importanceId {0} already exists'
  },
  RECOMMENDATION: {
    GET_API: 'RECOMMENDATION0001',
    POST_API: 'RECOMMENDATION0002',
    PUT_API: 'RECOMMENDATION0003',
    REQUESTED: 'Requested',
    REPLIED: 'Replied',
    ADDED: 'Added',
    CREATE_SUCCESS: 'Recommendation sent',
    DELETE_SUCCESS: 'Recommendation removed',
    UPDATE_SUCCESS: 'Recommendation added to profile',
    EDIT_SUCCESS: 'Recommendation updated successfully',
    UPDATE_FAIL: 'Recommendation already exists',
    NOT_IN_RANGE: 'This value should be between 1 to 10',
    RESPONSE_RECOMMENDATION: 'Recommendation response sent'
  },
  CONNECTION: {
    GET_API: 'CONNECTION0001',
    POST_API: 'CONNECTION0002',
    PUT_API: 'CONNECTION0003',
    REQUESTED: 'Requested',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    NO_CONNECTION: 'Add Friend',
    NO_CONNECTED: 'Not Connected',
    CREATE_SUCCESS: 'Connection request sent',
    UPDATE_SUCCESS: 'Connection request updated',
    DELETE_SUCCESS: 'Connection removed',
    DUPLICATE_REQUEST: 'Connection request already exists',
    PARENT_REMOVE_MINOR: 'Student can not remove their parent'
  },
  SUBSCRIPTION: {
    SUBSCRIBED: 'Subscribed',
    UNSUBSCRIBED: 'Unsubscribed',
    CREATE_SUCCESS: 'Subscription created',
    DELETE_SUCCESS: 'Subscription removed',
    UPDATE_SUCCESS: '{0} successfully',
    UPDATE_FAIL: 'Subscription with subscribeId {0} already exists'
  },
  MESSAGE: {
    CREATE_SUCCESS: 'Message details created',
    DELETE_SUCCESS: 'Message details removed',
    UPDATE_SUCCESS: 'Message details updated',
    UPDATE_FAIL: 'Message with messageId {0} already exists'
  },
  FEED: {
    CREATE_SUCCESS: 'Post created',
    DELETE_SUCCESS: 'Post removed'
  },
  HEADER: {
    CREATE_SUCCESS: 'Header created',
    DELETE_SUCCESS: 'Header removed',
    UPDATE_SUCCESS: 'Header updated'
  },
  VISIBILITY: {
    VISIBILITY_PRIVATE: 'Private',
    VISIBILITY_PUBLIC: 'Public',
    VISIBILITY_ALL_CONNECTIONS: 'AllConnections',
    VISIBILITY_SELECTED_CONNECTIONS: 'SelectedConnections'
  },
  NOTIFICATION: {
    CREATE_SUCCESS: 'Notification created',
    DELETE_SUCCESS: 'Notification removed',
    UPDATE_SUCCESS: 'Notification updated',
    GROUP_INVITATION: 'You have been invited to'
  },
  SHARED_PROFILE: {
    GET_API: 'SHAREDPROFILE0001',
    POST_API: 'SHAREDPROFILE0002',
    PUT_API: 'SHAREDPROFILE0003',
    CREATE_SUCCESS: 'Profile shared',
    DELETE_SUCCESS: 'Shared profile revoked',
    UPDATE_SUCCESS: 'Shared profile updated',
    UNKNOWN_SHARETYPE: 'Unknown shareType : {0}',
    MISSING_SHARETYPE: 'shareType value missing in request',
    SHARED_AS_EMAIL: 'Email',
    SHARED_AS_MESSAGE: 'Message',
    SHARE_PROFILE_CONTEXT: '/student/previewprofile/',
    UN_AUTHORISED_ACCESS: 'Sorry, You are not authorized to access this profile',
    NOT_FOUND: 'Share configuration not found'
  },
  GROUP: {
    STATUS: {
      REQUESTED: 'Requested',
      INVITED: 'Invited',
      ACCEPTED: 'Accepted',
      REJECTED: 'Rejected',
      REMOVED: 'Removed',
      PARENT_JOIN_ERROR: 'Parent can not join group'
    },
    TYPE: {
      PUBLIC: 'public',
      PRIVATE: 'private'
    },
    CREATE_SUCCESS: 'Group created',
    DELETE_SUCCESS: 'Group removed',
    UPDATE_SUCCESS: 'Group updated',
    LEAVE_SUCCESS: 'You have left the Group',
    MEMBER_ADDED: 'Group members invited',
    REQUEST_JOIN_GROUP: 'Request to join group sent',
    GROUP_JOINNED: 'Group joined successfully.',
    REQUEST_REJECT: 'Request to join group rejected',
    REQUEST_ACCEPT: 'Request to join group accepted',
    GROUP_NOT_FOUND: 'Group not found!',
    MEMBER_REMOVED: 'Member removed successfully.',
    MEMBER_ALREADY_IN_GROUP: 'Member already part of this group.',
    MEMBER_NOT_IN_GROUP: 'Not connected',
    GROUP_CREATED_BY_PARENT: 'Your parent has created group for you'
  },
  CONNECTION_STATUS: {
    NO_CONNECTION: 1,
    REQUESTED: 2,
    ACCEPTED: 3,
    INVITED: 4,
    SENT_REQUEST: 5,
    PEOPLE_YOU_MAY_KNOW: 6
  },
  COMPANY: {
    CREATE_SUCCESS: 'Company created',
    UPDATE_SUCCESS: 'Company updated',
    DELETE_SUCCESS: 'Company removed',
    DATA_RETRIEVE: 'Data retrieved successfully.'
  },
  OPPORTUNITY: {
    CREATE_SUCCESS: 'Opportuity created',
    UPDATE_SUCCESS: 'Opportuity updated',
    DELETE_SUCCESS: 'Opportuity removed',
    GROUP_ADDED: 'Group has been added in opportunity.',
    FORWARD_TO_PARENT: 'Feed forwarded to parent.',
    OPPORTUNITY_SHARED: "opportunity shared.",
    ALREADY_INQUIRED: "You have already inquired for this feed.",
    INQUIRE_SUCCESSFUL: "Inquiry submitted successfully."
  }, PLAN: {
    CREATE_SUCCESS: 'Plan created',
    UPDATE_SUCCESS: 'Plan updated',
    DELETE_SUCCESS: 'Plan removed'
  },
  INTERESTS: {
    CREATE_SUCCESS: 'Interest created',
    UPDATE_SUCCESS: 'Interest updated',
    DELETE_SUCCESS: 'Interest removed'
  },
  OFFERING: {
    CREATE_SUCCESS: 'Offering created',
    UPDATE_SUCCESS: 'Offering updated',
    DELETE_SUCCESS: 'Offering removed'
  },
  CALL_TO_ACTION: {
    LINK_URL: 1,
    JOIN_GROUP: 2,
    CALL_NOW: 3,
    INQUIRE_NOW: 4
  }
};

module.exports.CONSTANTS = CONSTANTS;