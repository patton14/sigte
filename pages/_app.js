import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import '../public/css/TimeLine.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import { SessionProvider } from 'next-auth/react';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    if (Component.getLayout) {
        return (
            <SessionProvider session={session}>

                    <LayoutProvider>
                        {Component.getLayout(
                            <Component {...pageProps} />
                        )}
                    </LayoutProvider>

            </SessionProvider>
        );
    } else {
        return (
            <SessionProvider session={session}>

                    <LayoutProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </LayoutProvider>

            </SessionProvider>
        );
    }
}
