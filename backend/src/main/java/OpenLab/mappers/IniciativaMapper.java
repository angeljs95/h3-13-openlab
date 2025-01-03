package OpenLab.mappers;

import OpenLab.dtos.IiniciativaDTO.IniciativaRequestDTO;
import OpenLab.dtos.IiniciativaDTO.IniciativaResponseDTO;
import OpenLab.dtos.IiniciativaDTO.IniciativasAndSocialsDTO;
import OpenLab.models.Iniciativa;

import OpenLab.models.Socials;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface IniciativaMapper {

    IniciativaMapper INSTANCE = Mappers.getMapper(IniciativaMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "monto_actual", constant = "0")
    @Mapping(target = "buy_price", constant = "150")
    @Mapping(target = "sell_price", constant = "140")
    @Mapping(target = "misiones_actuales", constant = "0")
    @Mapping(target = "misiones_objetivo", constant = "0")
    @Mapping(target = "colaboradores", constant = "0")
    @Mapping(target = "likes", constant = "0")
    @Mapping(target = "shares", constant = "0")
    @Mapping(target = "cliente", ignore = true)
    Iniciativa toEntity(IniciativaRequestDTO iniciativaRequestDTO);

    @Mapping(source = "fecha_creacion", target = "fechaCreacion")
    IniciativaResponseDTO toResponseDTO(Iniciativa iniciativa);

    List<IniciativaResponseDTO> toListResponseDTO(List<Iniciativa> iniciativa);
}
