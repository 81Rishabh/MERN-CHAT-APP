
function Avatar({w,h,imgURL}) {
  let originalUrl = imgURL;
  if(imgURL?.includes("uploads")) {
    originalUrl = 'http://localhost:8080' + imgURL;
  }

  return (
    <div
      style={{
        width: `${w}px`,
        height: `${h}px`,
        borderRadius: "50%",
        backgroundColor: "transparent",
        color: "#fff",
        cursor: "pointer",
        objectFit : 'contain',
      }}
      className="border border-gray-700"
    >
      {originalUrl && <img src={originalUrl} alt="avatar" width="100%" className="object-contain"/> }
    </div>
  );
}

export default Avatar;
