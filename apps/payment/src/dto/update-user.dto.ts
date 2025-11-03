import { PartialType } from "@nestjs/mapped-types";
import { CreatePaymentDto } from "./create-payment.dto";

export const UpdatePaymentDto = PartialType<CreatePaymentDto>;