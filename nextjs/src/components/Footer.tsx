import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 우아한테크코스 All Rights Reserved.</p>
      <p>
        <Image
          src="/images/woowacourse_logo.png"
          alt="우아한테크코스"
          width={180}
          height={26.5}
        />
      </p>
    </footer>
  );
};
