# Set Up External Authentication Examples

To authenticate the access to your GeoSpock DB, you'll need to configure an authentication provider and connect it with 
the GeoSpock DB. Here you'll find examples of how to do it for different providers.

## Amazon Cognito

[Amazon Cognito](https://aws.amazon.com/cognito/) is a simple user identity and data synchronization service provided by AWS.

>By using an Amazon Cognito user pool, you can create and maintain a user directory, and add sign-up and sign-in to your 
mobile app or web application. | AWS Documentation

### Step 1. Create a user pool

If you don't already have an user pool set up, see the 
[documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-as-user-directory.html)
on how to do it.

### Step 2. Add users to the user pool

If you don't already have users in your user pool, see the 
[documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/managing-users.html) 
on how to add them.

**Note**: Make sure to have at least one admin user set up that will later be used as the bootstrap user to connect with 
GeoSpock DB.

### Step 3. Add an app client to the user pool

1. In the user pool web console side menu go to `App clients` and add an app client. 
    1. Give the app client a name;
    2. Uncheck `Generate client secret`;
    3. Check `Enable username password auth for admin APIs for authentication (...)`;
    4. Check `Enable username password based authentication (...)`;
    5. Create app client.

2. In the user pool web console side menu go to `App client settings`. 
    1. Enable Cognito User Pool as an identity provider;
    2. Define the appropriate callback and sign out URL(s);
    3. OAuth 2.0:
       - Allowed OAuth Flows: `Authorization code grant`;
       - Allowed OAuth Scopes: `phone`, `email`, `openid`, `aws.cognito.signin.user.admin` and `profile`.
    4. Save changes.

### Step 4. Connect Amazon Cognito to GeoSpock DB

For details on how to install the GeoSpock DB refer to the available GeoSpock DB
[documentation](https://docs.website.eng.geospock.com/Content/deploy/deployGS_stack.htm).

1. Under the _Enterprise authentication_ section, uncomment and override the default values for the 
`cognito_user_pool` and `cognito_web_app` variables with the appropriate ones from Cognito's web console.

    _Default tfvars file excerpt:_
    ```
    # (Optional) Cognito User Pool ID of the pool to authenticate against if using Cognito authentication (string)
    # default: ""
    #cognito_user_pool = 
    
    # (Optional) Cognito App Client ID corresponding to the LDAP facade if using Cognito authenication (string)
    # default: ""
    #cognito_web_app = 
    ```

2. Under the _Management service_ section, uncomment and override the default value for the `root_admin_username` 
variable with the appropriate administrator user as mentioned in Step 2.

    _Default tfvars file excerpt:_
    ```
    # Username of root user administrator (string)
    # default: "Administrator"
    #root_admin_username = 
    ```

3. Install following the GeoSpock DB 
[documentation](https://docs.website.eng.geospock.com/Content/deploy/deployGS_stack.htm).

## LDAP

### Connect LDAP server to GeoSpock DB

For details on how to install the GeoSpock DB refer to the available GeoSpock DB
[documentation](https://docs.website.eng.geospock.com/Content/deploy/deployGS_stack.htm).

1. Under the _Enterprise authentication_ section, uncomment and override the default values for the 
`ldaps_bind_pattern`, `ldaps_server_host` and `ldaps_server_port` variables with the appropriate from your LDAP server.
    
    _Default tfvars file excerpt:_
    ```
    # (Optional) Bind pattern of LDAPS users - multiple DNs are separated by colons, for example: uid=${USER},ou=presto,dc=geospock,dc=com:uid=${USER},ou=query,dc=geospock,dc=com (string)
    # default: ""
    #ldaps_bind_pattern = ""
    
    # (Optional) Host of LDAPS server if using LDAPS authentication (string)
    # default: ""
    #ldaps_server_host = ""
    
    # (Optional) Port used by LDAPS server if using LDAPS authentication (string)
    # default: "1389"
    #ldaps_server_port = ""
    ```
2. Under the _Management service_ section, uncomment and override the default value for the `root_admin_username` 
variable with the appropriate administrator user configured in your LDAP server.

    _Default tfvars file excerpt:_
    ```
    # Username of root user administrator (string)
    # default: "Administrator"
    #root_admin_username = 
    ```

3. Install following the GeoSpock DB 
[documentation](https://docs.website.eng.geospock.com/Content/deploy/deployGS_stack.htm).