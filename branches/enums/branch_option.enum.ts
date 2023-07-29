import { ApiProperty, ApiTags } from "@nestjs/swagger";

// @ApiTags("ENUM")
// export class PAYMENT_OPTIONS_SWAGGER {
//     @ApiProperty({ description: "Enum Value" })
//     static CASH = 1;
//     @ApiProperty({ description: "Enum Value" })
//     static CARD = 2;
//     @ApiProperty({ description: "Enum Value" })
//     static BOTH = 3;
// }

// @ApiTags("ENUM")
// export class DELIVERY_OPTIONS_SWAGGER {
//     @ApiProperty({ description: "Enum Value" })
//     static HOME_DELIVERY = 1;
//     @ApiProperty({ description: "Enum Value" })
//     static PICK = 2;
//     @ApiProperty({ description: "Enum Value" })
//     static BOTH = 3;
// }

export enum PAYMENT_OPTIONS {
    CASH = 1,
    CARD,
    BOTH
}

export enum DELIVERY_OPTIONS {
    HOME_DELIVERY = 1,
    PICK,
    BOTH,
}
