export interface paths {
    "/api/Assets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["AssetResponseIEnumerableApiResponse"];
                        "application/json": components["schemas"]["AssetResponseIEnumerableApiResponse"];
                        "text/json": components["schemas"]["AssetResponseIEnumerableApiResponse"];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CreateAssetRequest"];
                    "text/json": components["schemas"]["CreateAssetRequest"];
                    "application/*+json": components["schemas"]["CreateAssetRequest"];
                };
            };
            responses: {
                /** @description Created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["AssetResponseApiResponse"];
                        "application/json": components["schemas"]["AssetResponseApiResponse"];
                        "text/json": components["schemas"]["AssetResponseApiResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["AssetResponseApiResponse"];
                        "application/json": components["schemas"]["AssetResponseApiResponse"];
                        "text/json": components["schemas"]["AssetResponseApiResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Assets/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["AssetResponseApiResponse"];
                        "application/json": components["schemas"]["AssetResponseApiResponse"];
                        "text/json": components["schemas"]["AssetResponseApiResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["AssetResponseApiResponse"];
                        "application/json": components["schemas"]["AssetResponseApiResponse"];
                        "text/json": components["schemas"]["AssetResponseApiResponse"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["UpdateAssetRequest"];
                    "text/json": components["schemas"]["UpdateAssetRequest"];
                    "application/*+json": components["schemas"]["UpdateAssetRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["AssetResponseApiResponse"];
                        "application/json": components["schemas"]["AssetResponseApiResponse"];
                        "text/json": components["schemas"]["AssetResponseApiResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["AssetResponseApiResponse"];
                        "application/json": components["schemas"]["AssetResponseApiResponse"];
                        "text/json": components["schemas"]["AssetResponseApiResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["AssetResponseApiResponse"];
                        "application/json": components["schemas"]["AssetResponseApiResponse"];
                        "text/json": components["schemas"]["AssetResponseApiResponse"];
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description No Content */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["ObjectApiResponse"];
                        "application/json": components["schemas"]["ObjectApiResponse"];
                        "text/json": components["schemas"]["ObjectApiResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["ObjectApiResponse"];
                        "application/json": components["schemas"]["ObjectApiResponse"];
                        "text/json": components["schemas"]["ObjectApiResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["ObjectApiResponse"];
                        "application/json": components["schemas"]["ObjectApiResponse"];
                        "text/json": components["schemas"]["ObjectApiResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Indexes/{indexType}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    from: string;
                    to: string;
                };
                header?: never;
                path: {
                    indexType: components["schemas"]["IndexType"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["IndexRateResponseIEnumerableApiResponse"];
                        "application/json": components["schemas"]["IndexRateResponseIEnumerableApiResponse"];
                        "text/json": components["schemas"]["IndexRateResponseIEnumerableApiResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["IndexRateResponseIEnumerableApiResponse"];
                        "application/json": components["schemas"]["IndexRateResponseIEnumerableApiResponse"];
                        "text/json": components["schemas"]["IndexRateResponseIEnumerableApiResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Portfolio/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    referenceDate?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["PortfolioSummaryResponseApiResponse"];
                        "application/json": components["schemas"]["PortfolioSummaryResponseApiResponse"];
                        "text/json": components["schemas"]["PortfolioSummaryResponseApiResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["PortfolioSummaryResponseApiResponse"];
                        "application/json": components["schemas"]["PortfolioSummaryResponseApiResponse"];
                        "text/json": components["schemas"]["PortfolioSummaryResponseApiResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["PortfolioSummaryResponseApiResponse"];
                        "application/json": components["schemas"]["PortfolioSummaryResponseApiResponse"];
                        "text/json": components["schemas"]["PortfolioSummaryResponseApiResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Positions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["PositionResponseIEnumerableApiResponse"];
                        "application/json": components["schemas"]["PositionResponseIEnumerableApiResponse"];
                        "text/json": components["schemas"]["PositionResponseIEnumerableApiResponse"];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CreatePositionRequest"];
                    "text/json": components["schemas"]["CreatePositionRequest"];
                    "application/*+json": components["schemas"]["CreatePositionRequest"];
                };
            };
            responses: {
                /** @description Created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["PositionResponseApiResponse"];
                        "application/json": components["schemas"]["PositionResponseApiResponse"];
                        "text/json": components["schemas"]["PositionResponseApiResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["PositionResponseApiResponse"];
                        "application/json": components["schemas"]["PositionResponseApiResponse"];
                        "text/json": components["schemas"]["PositionResponseApiResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["PositionResponseApiResponse"];
                        "application/json": components["schemas"]["PositionResponseApiResponse"];
                        "text/json": components["schemas"]["PositionResponseApiResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Positions/{id}/projection": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    referenceDate?: string;
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["PositionProjectionResponseApiResponse"];
                        "application/json": components["schemas"]["PositionProjectionResponseApiResponse"];
                        "text/json": components["schemas"]["PositionProjectionResponseApiResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["PositionProjectionResponseApiResponse"];
                        "application/json": components["schemas"]["PositionProjectionResponseApiResponse"];
                        "text/json": components["schemas"]["PositionProjectionResponseApiResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["PositionProjectionResponseApiResponse"];
                        "application/json": components["schemas"]["PositionProjectionResponseApiResponse"];
                        "text/json": components["schemas"]["PositionProjectionResponseApiResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AssetResponse: {
            /** Format: uuid */
            id?: string;
            name?: string | null;
            issuer?: string | null;
            assetType?: string | null;
            indexType?: string | null;
            /** Format: double */
            rate?: number;
            /** Format: date */
            issueDate?: string;
            /** Format: date */
            maturityDate?: string;
        };
        AssetResponseApiResponse: {
            /** Format: int32 */
            readonly statusCode?: number;
            readonly success?: boolean;
            readonly message?: string | null;
            data?: components["schemas"]["AssetResponse"];
        };
        AssetResponseIEnumerableApiResponse: {
            /** Format: int32 */
            readonly statusCode?: number;
            readonly success?: boolean;
            readonly message?: string | null;
            readonly data?: components["schemas"]["AssetResponse"][] | null;
        };
        /** @enum {string} */
        AssetType: "Cdb" | "Lci" | "Lca" | "TreasuryBond";
        AssetTypeSummaryResponse: {
            assetType?: components["schemas"]["AssetType"];
            /** Format: int32 */
            positionCount?: number;
            /** Format: double */
            totalInvestedAmount?: number;
            /** Format: double */
            totalNetAmount?: number;
            /** Format: double */
            percentage?: number;
        };
        CreateAssetRequest: {
            name?: string | null;
            issuer?: string | null;
            assetType?: string | null;
            indexType?: string | null;
            /** Format: double */
            rate?: number;
            /** Format: date */
            issueDate?: string;
            /** Format: date */
            maturityDate?: string;
        };
        CreatePositionRequest: {
            /** Format: uuid */
            assetId?: string;
            /** Format: double */
            investedAmount?: number;
            /** Format: date */
            applicationDate?: string;
        };
        IndexRateResponse: {
            indexType?: components["schemas"]["IndexType"];
            /** Format: date */
            referenceDate?: string;
            /** Format: double */
            value?: number;
        };
        IndexRateResponseIEnumerableApiResponse: {
            /** Format: int32 */
            readonly statusCode?: number;
            readonly success?: boolean;
            readonly message?: string | null;
            readonly data?: components["schemas"]["IndexRateResponse"][] | null;
        };
        /** @enum {string} */
        IndexType: "PreFixed" | "Cdi" | "Ipca";
        ObjectApiResponse: {
            /** Format: int32 */
            readonly statusCode?: number;
            readonly success?: boolean;
            readonly message?: string | null;
            readonly data?: unknown;
        };
        PortfolioPositionResponse: {
            projection?: components["schemas"]["PositionProjectionResponse"];
            asset?: components["schemas"]["AssetResponse"];
        };
        PortfolioSummaryResponse: {
            /** Format: double */
            totalInvestedAmount?: number;
            /** Format: double */
            totalGrossAmount?: number;
            /** Format: double */
            totalGrossYield?: number;
            /** Format: double */
            totalTaxAmount?: number;
            /** Format: double */
            totalIofAmount?: number;
            /** Format: double */
            totalNetAmount?: number;
            /** Format: int32 */
            positionCount?: number;
            byAssetType?: components["schemas"]["AssetTypeSummaryResponse"][] | null;
            /** Format: date */
            referenceDate?: string;
            positions?: components["schemas"]["PortfolioPositionResponse"][] | null;
        };
        PortfolioSummaryResponseApiResponse: {
            /** Format: int32 */
            readonly statusCode?: number;
            readonly success?: boolean;
            readonly message?: string | null;
            data?: components["schemas"]["PortfolioSummaryResponse"];
        };
        PositionProjectionResponse: {
            /** Format: uuid */
            positionId?: string;
            /** Format: uuid */
            assetId?: string;
            /** Format: double */
            investedAmount?: number;
            /** Format: double */
            grossAmount?: number;
            /** Format: double */
            grossYield?: number;
            /** Format: double */
            taxRate?: number;
            /** Format: double */
            taxAmount?: number;
            /** Format: double */
            netAmount?: number;
            /** Format: int32 */
            elapsedDays?: number;
            /** Format: int32 */
            businessDays?: number;
            /** Format: double */
            iofRate?: number;
            /** Format: double */
            iofAmount?: number;
            isEstimated?: boolean;
            /** Format: date */
            referenceDate?: string;
            /** Format: date */
            applicationDate?: string;
        };
        PositionProjectionResponseApiResponse: {
            /** Format: int32 */
            readonly statusCode?: number;
            readonly success?: boolean;
            readonly message?: string | null;
            data?: components["schemas"]["PositionProjectionResponse"];
        };
        PositionResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            assetId?: string;
            /** Format: double */
            investedAmount?: number;
            /** Format: date */
            applicationDate?: string;
        };
        PositionResponseApiResponse: {
            /** Format: int32 */
            readonly statusCode?: number;
            readonly success?: boolean;
            readonly message?: string | null;
            data?: components["schemas"]["PositionResponse"];
        };
        PositionResponseIEnumerableApiResponse: {
            /** Format: int32 */
            readonly statusCode?: number;
            readonly success?: boolean;
            readonly message?: string | null;
            readonly data?: components["schemas"]["PositionResponse"][] | null;
        };
        UpdateAssetRequest: {
            name?: string | null;
            issuer?: string | null;
            /** Format: double */
            rate?: number;
            /** Format: date */
            issueDate?: string;
            /** Format: date */
            maturityDate?: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
