package com.example.tsmstlu.utils;

import com.example.tsmstlu.models.SemesterEntity;
import com.example.tsmstlu.dtos.semester.*;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface MapperUtils {
    MapperUtils INSTANCE = Mappers.getMapper(MapperUtils.class);

    @Mapping(target = "term", source = "term", qualifiedByName = "termToString")
    @Mapping(target = "status", source = "status", qualifiedByName = "statusToString")
    SemesterDto toDto(SemesterEntity entity);

    @Mapping(target = "term", source = "term", qualifiedByName = "stringToTerm")
    @Mapping(target = "status", source = "status", qualifiedByName = "stringToStatus")
    SemesterEntity toEntity(SemesterDto dto);

    @Named("termToString")
    static String termToString(SemesterEntity.Term term) {
        return term != null ? term.name() : null;
    }

    @Named("stringToTerm")
    static SemesterEntity.Term stringToTerm(String term) {
        return term != null ? SemesterEntity.Term.valueOf(term) : null;
    }

    @Named("statusToString")
    static String statusToString(SemesterEntity.SemesterStatus status) {
        return status != null ? status.name() : null;
    }

    @Named("stringToStatus")
    static SemesterEntity.SemesterStatus stringToStatus(String status) {
        return status != null ? SemesterEntity.SemesterStatus.valueOf(status) : null;
    }
}
