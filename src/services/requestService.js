const getData = async (url) => {
    let response = null
    try {;
        const result = await fetch(url);
        if (!result.ok) {
            const data = await result.text();
            response = {
                status: result.status,
                data: data
            }
        } else {
            data = await result.json();
            response = {
                status: result.status,
                data: data
            }
        }
    } catch (error) {
        console.error('Error', error)
    }
    return response;
}

module.exports = {
    getData
}