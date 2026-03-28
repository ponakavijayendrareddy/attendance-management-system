import styles from "../../styles/glass-neumorphic.module.css";

export function Toast({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return <div className={`${styles.cardGlass} border-rose-200 text-sm text-rose-700`}>{message}</div>;
}
