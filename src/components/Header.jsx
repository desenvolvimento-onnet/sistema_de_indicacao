import styles from './Header.module.css'
import logo from '../images/logoonnet.png';

export function Header(){
    return(
        <header className={styles.header}>
            <img src={logo} alt="Logo OnNet" />
        </header>
    );
}