import {
    Form,
    FormLayout,
    TextField,
    Button,
    TextContainer,
    Card,
    Page,
    Layout,
    Image,
    Stack,
    Spinner,
    InlineError
} from "@shopify/polaris";
import {useCallback, useState, useEffect, useRef} from 'react';
import {TitleBar} from "@shopify/app-bridge-react";
import {ameriabank} from "../assets";
import {useAuthenticatedFetch} from '../hooks'

export default function HomePage() {
    //! Refs
    const defaultErrorMessagesObj = useRef({
        clientId: '',
        username: '',
        password: '',
        globalErrorMessage: ''
    })

    //! States
    const [clientId, setClientId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState(defaultErrorMessagesObj.current)

    //! Auth Fetch Hook
    const authFetch = useAuthenticatedFetch()

    //! Getting current values
    const getCurrentValues = useCallback(() => {
        authFetch('/api/credentials').then((response) => response.json()).then(({clientId, username, password}) => {
            setClientId(clientId)
            setUsername(username)
            setPassword(password)
        })
    }, [])

    //! Document did mount
    useEffect(() => {
        getCurrentValues()
    }, [])

    //! Handle submit
    const handleSubmit = useCallback(async (_event) => {
        setErrorMessages(defaultErrorMessagesObj.current)
        setLoading(true)

        await authFetch('/api/credentials', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({clientId, username, password})
        }).then(res => {
            return res.json()
        })
            .then(data => {
                let msgs

                if (data.errors) {
                    msgs = data.errors
                }
                if (data.message && !data.errors) {
                    msgs = {...msgs, globalErrorMessage: data.message}
                }

                msgs && setErrorMessages(msgs)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [clientId, username, password]);

    //! Handle form item change
    const handleChange = useCallback((name, val) => {
        eval(`set${name}(val)`)
    }, []);

    return (
        <Page narrowWidth>
            <TitleBar title="AmeriaBank vPOS" primaryAction={null}/>
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <Stack
                            wrap={false}
                            spacing="extraTight"
                            distribution="trailing"
                            alignment="center"
                        >
                            <Stack.Item fill>
                                <TextContainer>
                                    <Image alt={'AmeriaBank'} source={ameriabank} width={'200px'}></Image>
                                    <p>
                                        In order to finalize the setup process of AmeriaPay, you should first obtain your account’s Client ID, Username, Password and add this app to your store.
                                    </p>
                                </TextContainer>
                            </Stack.Item>
                        </Stack>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <Card sectioned>
                        <Stack
                            wrap={false}
                            spacing="extraTight"
                            distribution="trailing"
                            alignment="center"
                        >
                            <Stack.Item fill>

                                {errorMessages.globalErrorMessage && (
                                    <div style={{
                                        padding: '2em',
                                        border: '1px solid var(--p-text-critical)',
                                        borderRadius: '0.25rem',
                                        marginBottom: '3em'
                                    }}>
                                        <InlineError message={errorMessages.globalErrorMessage}/>
                                    </div>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <FormLayout>
                                        <TextField error={errorMessages.clientId} onChange={(val) => handleChange('ClientId', val)} label="Client ID" type="text" value={clientId}/>
                                        <TextField error={errorMessages.username} onChange={(val) => handleChange('Username', val)} label="Username" type="text" value={username}/>
                                        <TextField error={errorMessages.password} onChange={(val) => handleChange('Password', val)} label="Password" type="password" value={password}/>

                                        {loading ? <Spinner size="large"/> : <Button submit>Save</Button>}
                                    </FormLayout>
                                </Form>


                            </Stack.Item>
                        </Stack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
