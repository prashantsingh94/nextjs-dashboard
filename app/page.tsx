import styles from "@/app/ui/home.module.css";
import { lusitana } from "@/app/ui/fonts";
import Image from "next/image";
export default function Home() {
  return (
    <main>
      <div className={`${styles.shape}`}>
        Hello, This is Prashant Singh, I am a Full Stack Engineer.
        <p className={`${lusitana.className}`}>
          I am passionate about building modern web applications using the
          latest technologies.
        </p>
        <Image
          className="mt-2"
          src="/profile.jpg"
          alt="Prashant Singh profile picture"
          width={150}
          height={150}
        />
      </div>
    </main>
  );
}
