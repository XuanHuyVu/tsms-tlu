package com.example.tsmstlu.services;

import java.util.List;

public interface BaseService<T, D, ID> {
    D getById(ID id);
    D create(D dto);
    D update(ID id, D dto);
    void delete(ID id);
    List<D> getAll();
}

