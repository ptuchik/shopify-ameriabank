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
    Spinner
} from "@shopify/polaris";
import {useCallback, useState, useEffect} from 'react';
import {TitleBar} from "@shopify/app-bridge-react";
import {ameriabank} from "../assets";
import {useAuthenticatedFetch} from '../hooks'

export default function HomePage() {
    const [clientId, setClientId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)

    const authFetch = useAuthenticatedFetch()

    const getCurrentValues = useCallback(() => {
        authFetch('/api/credentials').then((response) => response.json()).then(({clientId, username, password}) => {
            setClientId(clientId)
            setUsername(username)
            setPassword(password)
        })
    }, [])

    useEffect(() => {
        getCurrentValues()
    }, [])

    const handleSubmit = useCallback(async (_event) => {
        setLoading(true)
        await authFetch('/api/credentials', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({clientId, username, password})
        }).finally(() => {
            setLoading(false)
        })
    }, [clientId, username, password]);

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
                                <Form onSubmit={handleSubmit}>
                                    <FormLayout>
                                        <TextField onChange={(val) => handleChange('ClientId', val)} label="Client ID" type="text" value={clientId}/>
                                        <TextField onChange={(val) => handleChange('Username', val)} label="Username" type="text" value={username}/>
                                        <TextField onChange={(val) => handleChange('Password', val)} label="Password" type="password" value={password}/>

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
