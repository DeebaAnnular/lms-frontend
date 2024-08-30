export const postAssetDetails = async (assetData) => {
    try {
        const response = await fetch('http://localhost:3000/api/assets/create_asset', {
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
        const response = await fetch("http://localhost:3000/api/assets/get_all_assets");
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

export const postAccessCardDetails = async (accessCardData) => {
    try {
        const response = await fetch('http://localhost:3000/api/access_card/create_access_card', {
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
        const response = await fetch('http://localhost:3000/api/access_card/get_all_access_card', {
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
        const response = await fetch('http://localhost:3000/api/assets/create_asset_for_maintenance', {
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
        const response = await fetch('http://localhost:3000/api/assets/get_all_assets_for_maintenance', {
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
        const response = await fetch('http://localhost:3000/api/assets/map_asset_with_employee', {
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
        const response = await fetch('http://localhost:3000/api/assets/return_asset_to_admin', {
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



