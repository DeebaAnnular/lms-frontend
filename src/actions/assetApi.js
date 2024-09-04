export const api="https://lms-api.annularprojects.com:3001"
export const postAssetDetails = async (assetData) => {
    try {
        const response = await fetch('https://lms-api.annularprojects.com:3001/api/assets/create_asset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assetData),
        });

        const statusCode = response.status;
        const data = await response.json();
        const resmessage=data.message;
        return { statusCode,resmessage }; // Return the fetched data
        

    } catch (error) {
        
        console.error('There has been a problem with your fetch operation:', error.message);
        return { error:error }; // Return the error message
    }
}; 

export const getAllAssets = async () => {
    try {
        const response = await fetch("https://lms-api.annularprojects.com:3001/api/assets/get_all_assets");
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Return an empty array on error
    }
};  

export const updateAssetDetails = async (id, assetData) => {
    try {
        console.log("assetdata",assetData)
        const response = await fetch(`${api}/api/assets/update_asset/${id}`, { // Use backticks for template literals
            method: 'PUT', // Use PUT or PATCH depending on your API design
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assetData),
        });

        const data = await response.json(); // Await the JSON parsing of the response
        const statusCode = response.status;
        const resmessage = data.message;
        return { statusCode, resmessage }; // Return status code and message

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error.message);
        return { error: error.message }; // Return the error message
    }
};



export const postAccessCardDetails = async (accessCardData) => {
    try {
        const response = await fetch('https://lms-api.annularprojects.com:3001/api/access_card/create_access_card', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(accessCardData),
        });

        const statusCode = response.status;
        const data = await response.json();
        const resmessage = data.error;
        console.log("resmessage",resmessage)
        
        return { statusCode, resmessage }; // Return the status code and message

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error.message);
        return { error: error.message }; // Return the error message
    }
};


export const getAllAccessCardDetails = async () => {
    try {
        const response = await fetch('https://lms-api.annularprojects.com:3001/api/access_card/get_all_access_card', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const statusCode = response.status;
        const data = await response.json();
        const resmessage = data.error ? data.error : 'Success';

        return { statusCode, data, resmessage }; // Return the status code, data, and message

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error.message);
        return { error: error.message }; // Return the error message
    }
};

export const postAssetForMaintenance = async (assetData) => {
    try {
        const response = await fetch('https://lms-api.annularprojects.com:3001/api/assets/create_asset_for_maintenance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assetData),
        });

        const statusCode = response.status;
        const data = await response.json();
        const resmessage = data.error;

        return { statusCode, resmessage }; // Return the status code and message

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error.message);
        return { error: error.message }; // Return the error message
    }
}; 

export const getAllAssetsForMaintenance = async () => {
    try {
        const response = await fetch('https://lms-api.annularprojects.com:3001/api/assets/get_all_assets_for_maintenance', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const statusCode = response.status;
        const data = await response.json();
        const resmessage = data.error ? data.error : 'Success';

        return { statusCode, data, resmessage }; // Return the status code, data, and message

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error.message);
        return { error: error.message }; // Return the error message
    }
}; 

export const postmapAssetWithEmployee = async (assetData) => {
    try {
        const response = await fetch('https://lms-api.annularprojects.com:3001/api/assets/map_asset_with_employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assetData),
        });

        const statusCode = response.status;
        const data = await response.json();
        const resmessage = data.error || data.message;

        return { statusCode, resmessage }; // Return the status code and message

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error.message);
        return { error: error.message }; // Return the error message
    }
};  

export const returnAssetToAdmin = async (assetData) => {
    try {
        const response = await fetch('https://lms-api.annularprojects.com:3001/api/assets/return_asset_to_admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assetData),
        });

        const statusCode = response.status;
        const data = await response.json();
        const resmessage = data.error;

        return { statusCode, resmessage }; // Return the status code and message
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error.message);
        return { error: error.message }; // Return the error message
    }
};  

export const deleteAsset = async (assetId) => {
    try {
      const response = await fetch(`https://lms-api.annularprojects.com:3001/api/assets/delete_asset/${assetId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Asset deleted successfully:", result.message);
        // Optionally show a success message or update the UI
      } else {
        console.error("Failed to delete asset:", response.error);
        // Optionally handle the error
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };



