/*

Provide a way for the user to supply username and password credentials to be used for the database connection.
Credentials are stored obfuscated in the browser's session storage.

 */


const authKeyName = "auth";

function getStoredAuth() {
    try {
        return sessionStorage.getItem(authKeyName)
            && JSON.parse(atob(sessionStorage.getItem(authKeyName)))
    } catch (e) {
        return null;
    }
}

function storeAuth(auth) {
    sessionStorage.setItem(authKeyName, btoa(JSON.stringify(auth)));
}

module.exports = function() {
    return new Promise((resolve, reject) => {
        let auth = getStoredAuth();

        document.querySelector(".logout").onclick = () => {
            localStorage.setItem(authKeyName, null);
            location.reload();
        };

        if (auth) {
            resolve(auth);
        } else {
            document.querySelector("#auth").style.display = "grid";
            document.querySelector("#auth button").onclick = event => {
                event.preventDefault();
                let username = document.querySelector("#auth .username").value;
                let password = document.querySelector("#auth .password").value;
                auth = {username, password};
                storeAuth(auth);
                document.querySelector("#auth").style.display = "none";
                resolve(auth);
            };
        }
    });
};
