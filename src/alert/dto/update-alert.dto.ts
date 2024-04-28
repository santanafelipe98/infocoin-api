import { Type } from "class-transformer";
import { UpdateConditionDto } from "./update-condition.dto";
import { ValidateNested } from "class-validator";

export class UpdateAlertDto {
    @ValidateNested()
    @Type(() => UpdateConditionDto)
    condition: UpdateConditionDto;
}