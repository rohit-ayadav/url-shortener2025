'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './NotFound.module.css';

const NotFound = () => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(4);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);

        const redirectTimeout = setTimeout(() => {
            router.push('/');
        }, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimeout);
        };
    }, [router]);

    return (
        <div>
            <h1 className={styles.heading}>404 - Page Not Found</h1>
            <p className={styles.para}>
                The page you are looking for does not exist.
            </p>

            <p className={styles.para}>
                Redirecting to <a href="/">home</a> page in {countdown} seconds...
            </p>
        </div>
    );
}

export default NotFound;
