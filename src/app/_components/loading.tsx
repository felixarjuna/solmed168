import Image from "next/image";
import loading from "public/loading.gif";

export default function PageLoader() {
  return (
    <div className="-my-20 flex h-svh items-center justify-center">
      <Image src={loading} alt="Loading..." width={150} height={150} />
    </div>
  );
}
