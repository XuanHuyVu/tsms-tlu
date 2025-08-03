package com.example.tsmstlu.services.impl;

import com.example.tsmstlu.services.BaseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
public abstract class BaseServiceImpl<T, D, ID>  implements BaseService<T, D, ID> {

    protected final JpaRepository<T, ID> repository;
    protected abstract D toDto(T entity);
    protected abstract T toEntity(D dto);

    public List<D> getAll() {
        return repository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public D getById(ID id) {
        Optional<T> optional = repository.findById(id);
        if (optional.isEmpty()) {
            log.warn("Entity with id {} not found.", id);
            return null;
        }
        return toDto(optional.get());
    }

    public D create(D dto) {
        T entity = toEntity(dto);
        return toDto(repository.save(entity));
    }

    public D update(ID id, D dto) {
        if (!repository.existsById(id)) {
            log.warn("Update failed: entity with id {} not found.", id);
            return null;
        }
        T entity = toEntity(dto);
        setId(entity, id); // abstract method to be implemented
        return toDto(repository.save(entity));
    }

    public void delete(ID id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            log.warn("Delete failed: entity with id {} not found.", id);
        }
    }

    protected abstract void setId(T entity, ID id);
}

