export default function ProcessingScreen() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/loading.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
