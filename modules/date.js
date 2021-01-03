module.exports = getDate;

function getDate() {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
    };
        
    return today.toLocaleDateString("en-US", options);
}