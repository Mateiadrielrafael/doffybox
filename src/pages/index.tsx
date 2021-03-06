import "preact/compat"
import { Col, Block, Box, Row, Grid } from "jsxstyle"
import { useState, useCallback } from "preact/hooks"
import { WsClient } from "../hooks/useWebsocket"
import { WSOngoingActions } from "../types/Action"
import Link from "next/link"
import { bg } from "../constants"
import { useClassroom } from "../stores/classroom"
import { Metadata } from "../components/Metadata"
import NumberFormat from "react-number-format"

const mediaQueries = {
    lg: "screen and (max-width: 1120px)",
    sm: "screen and (max-width: 545px)"
}

interface Props {
    ws: WsClient<WSOngoingActions> | null
}

export default function Home({ ws }: Props) {
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const classroom = useClassroom()

    const createClassroom = useCallback(() => {
        if (!ws) return

        ws.send({
            type: "createClassroom",
            data: { name }
        })
    }, [name, ws])

    const joinClassroom = useCallback(() => {
        if (!ws) return

        const unformatted = code.split(" ").join("")

        ws.send({
            type: "joinClassroom",
            data: { code: unformatted, username: classroom.username }
        })
    }, [code, classroom.username, ws])

    return (
        <>
            <Metadata
                title="Home"
                description="Join or create your own classrooms"
            />
            <Row
                mediaQueries={mediaQueries}
                lgFlexDirection="column"
                height="100vh"
                width="100%"
                background={bg}
                alignItems="center"
                justifyContent="center"
            >
                <Col
                    justifyContent="center"
                    alignItems="center"
                    class="block wrap"
                    // These 2 overwrite the theme
                    cursor="default !important"
                    padding="2rem !important"
                >
                    <Block
                        component="h1"
                        fontSize="3rem"
                        mediaQueries={mediaQueries}
                        textAlign="center"
                        smFontSize="2rem"
                    >
                        Join classroom
                    </Block>
                    <Col>
                        <Block
                            padding="0.7rem"
                            fontSize="1.5rem"
                            component="input"
                            textAlign="center"
                            class="block wrap"
                            width="100%"
                            props={{
                                name: "Username",
                                placeholder: "Jhon Titor",
                                type: "text",
                                maxlength: 20,
                                onChange: e =>
                                    classroom.set({ username: e.target.value }),
                                value: classroom.username,
                                autocomplete: "off"
                            }}
                        ></Block>
                        <Block
                            padding="0.7rem"
                            fontSize="1.5rem"
                            component={NumberFormat}
                            textAlign="center"
                            class="block wrap"
                            width="100%"
                            props={{
                                name: "Room id",
                                placeholder: "Room code",
                                onValueChange: e => {
                                    return setCode(e.formattedValue)
                                },
                                value: code,
                                isNumericalString: true,
                                format: "# # # # # #",
                                mask: "_"
                            }}
                        ></Block>
                        <Link href="/[code]" as={`/${code}`}>
                            <Box
                                component="a"
                                class="block accent"
                                marginTop="2rem !important"
                                fontSize="2rem"
                                width="100%"
                                textAlign="center"
                                props={{ onClick: joinClassroom }}
                            >
                                Join
                            </Box>
                        </Link>
                    </Col>
                </Col>

                <Block class="block" margin="2rem !important">
                    or
                </Block>
                <Col
                    justifyContent="center"
                    alignItems="center"
                    class="block wrap accent"
                    // These 2 overwrite the theme
                    cursor="default !important"
                    padding="2rem !important"
                >
                    <Block
                        component="h1"
                        fontSize="3rem"
                        mediaQueries={mediaQueries}
                        textAlign="center"
                        smFontSize="2rem"
                    >
                        Create your own
                    </Block>
                    <Col>
                        <Block
                            padding="0.7rem"
                            fontSize="1.5rem"
                            component="input"
                            textAlign="center"
                            class="block wrap"
                            width="100%"
                            props={{
                                name: "Room name",
                                placeholder: "My awesome classroom",
                                type: "text",
                                maxlength: 30,
                                onChange: e => setName(e.target.value),
                                value: name,
                                autocomplete: "off"
                            }}
                        ></Block>
                        <Link href="/[code]" as="/">
                            <Box
                                component="a"
                                class="block"
                                marginTop="2rem !important"
                                fontSize="2rem"
                                width="100%"
                                textAlign="center"
                                props={{ onClick: createClassroom }}
                            >
                                Create
                            </Box>
                        </Link>
                    </Col>
                </Col>
            </Row>
        </>
    )
}
